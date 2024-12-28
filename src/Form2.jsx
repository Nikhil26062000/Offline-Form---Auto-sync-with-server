import React, { useEffect, useState } from "react";
import {
  getAllDataFromIndexedDB,
  deleteDataFromIndexedDB,
  saveDataToIndexedDB,
  updateDataInIndexedDB, // Add this function to update IndexedDB entries
} from "../src/utils/indexedDB";
import { useNavigate } from "react-router-dom";
// import "./Form.css";

const Form2 = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: null,
  });
  const [offlineData, setOfflineData] = useState([]);
  const [syncedData, setSyncedData] = useState([]);
  const storeName = "school-data";

  const navigate = useNavigate()

    const handleForm1Click = () => {
        navigate('/form')
    }

    const handleForm2Click = () => {
        navigate('/form2')
    }


  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    isOnline().then((status) => {
          if (status) {
            console.log("Internet is available");
            // Simulate server sync
            saveDataToIndexedDB(storeName, { ...formData, isSynced: true });
            setSyncedData((prev) => [...prev, formData]);
            console.log("form1 Data sent to server ", formData);
          } else {
            console.log("No internet connection");
            // Save data to IndexedDB if offline
            saveDataToIndexedDB(storeName, { ...formData, isSynced: false });
            setOfflineData((prev) => [...prev, formData]);
            console.log("form1 Data saved locally  because you are offline.");
          }
        });

    // if (navigator.onLine) {
    //   // Simulate server sync
    //   saveDataToIndexedDB(storeName, { ...formData, isSynced: true });
    //   setSyncedData((prev) => [...prev, formData]);
    //   console.log("form2 Data sent to server", formData);
    // } else {
    //   // Save data to IndexedDB if offline
    //   saveDataToIndexedDB(storeName, { ...formData, isSynced: false });
    //   setOfflineData((prev) => [...prev, formData]);
    //   console.log("form2 Data saved locally because you are offline.");
    // }

    // Clear form after submission
    setFormData({
      name: "",
      email: "",
      image: null,
    });
  };

    // Sync IndexedDB data to server when online
    const syncDataToServer = async () => {
      const data = await getAllDataFromIndexedDB(storeName);
  
      if (navigator.onLine) {
        console.log("form2 You are online");
        for (const item of data) {
          if (!item.isSynced) {
            try {
              // Simulate server sync
              setSyncedData((prev) =>{
                item.isSynced = true;
                return [...prev, item]
              });
    
              // Update the item in IndexedDB to mark it as synced
              await updateDataInIndexedDB(storeName, { ...item, isSynced: true });
              console.log(`form2 Synced  data: ${item.name}`);
            } catch (error) {
              console.error("form2 Failed to sync  data:", item, error);
            }
            deleteDataFromIndexedDB(storeName,item.id)
    
          }else{
               deleteDataFromIndexedDB(storeName, item.id);
    
          }
        }
    
        setOfflineData([]);
  
    } else {
        console.log("form2 : You are offline");
    }
  
     
    };

  // // Listen for online event to sync data
  // useEffect(() => {
  //   const handleOnline = async () => {
  //   //   alert("form2 Internet connection restored . Syncing data to server...");
  //     console.log("form2 Internet connection restored form2. Syncing data to server...");
  //     await syncDataToServer();
  //   };

  //   window.addEventListener("online", handleOnline);

  //   return () => {
  //     window.removeEventListener("online", handleOnline);
  //   };
  // }, []);


  // useEffect(()=>{
  //   const handleOnline2 = async () => {
  //       // alert("When comp render Syncing data to server...");
  //       await syncDataToServer();
  //     };
      
  //     handleOnline2()
  // },[])

  return (
    <div className="form-container">
     <button onClick={handleForm1Click}>Form 1</button>
     <button onClick={handleForm2Click}>Form 2</button>
      <h1 className="form-header">User Form2</h1>
      <form onSubmit={handleSubmit} className="form">
        <label className="form-label">
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Image:
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            className="form-input"
          />
        </label>
        <button type="submit" className="form-submit">
          Submit
        </button>
      </form>

      <div className="data-container">
        <div className="online-data">
          <h2>Synced Data (Online) for Form2</h2>
          {syncedData.length > 0 ? (
            syncedData.map((item, index) => (
              <div key={index} className="data-item">
                <p>Name: {item.name}</p>
                <p>Email: {item.email}</p>
                {item.image && (
                  <img
                    src={URL.createObjectURL(item.image)}
                    alt="Uploaded"
                    className="data-image"
                  />
                )}
              </div>
            ))
          ) : (
            <p>No synced data yet.</p>
          )}
        </div>

        <div className="offline-data">
          <h2>Offline Data for Form2</h2>
          {offlineData.length > 0 ? (
            offlineData.map((item, index) => (
              <div key={index} className="data-item">
                <p>Name: {item.name}</p>
                <p>Email: {item.email}</p>
                {item.image && (
                  <img
                    src={URL.createObjectURL(item.image)}
                    alt="Uploaded"
                    className="data-image"
                  />
                )}
              </div>
            ))
          ) : (
            <p>No offline data saved.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form2;
