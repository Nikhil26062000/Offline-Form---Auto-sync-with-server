import React, { useEffect, useState } from "react";
import {
  getAllDataFromIndexedDB,
  deleteDataFromIndexedDB,
  saveDataToIndexedDB,
  updateDataInIndexedDB, // Add this function to update IndexedDB entries
} from "../src/utils/indexedDB";
// import "./Form.css";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: null,
  });
  const [offlineData, setOfflineData] = useState([]);
  const [syncedData, setSyncedData] = useState([]);
  const storeName = "form-data";

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

    if (navigator.onLine) {
      // Simulate server sync
      saveDataToIndexedDB(storeName, { ...formData, isSynced: true });
      setSyncedData((prev) => [...prev, formData]);
      console.log("Data sent to server", formData);
    } else {
      // Save data to IndexedDB if offline
      saveDataToIndexedDB(storeName, { ...formData, isSynced: false });
      setOfflineData((prev) => [...prev, formData]);
      console.log("Data saved locally because you are offline.");
    }

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

    for (const item of data) {
      if (!item.isSynced) {
        try {
          // Simulate server sync
          setSyncedData((prev) => [...prev, item]);

          // Update the item in IndexedDB to mark it as synced
          await updateDataInIndexedDB(storeName, { ...item, isSynced: true });
          console.log(`Synced data: ${item.name}`);
        } catch (error) {
          console.error("Failed to sync data:", item, error);
        }
        deleteDataFromIndexedDB(storeName,item.id)

      }else{
           deleteDataFromIndexedDB(storeName, item.id);

      }
    }

    setOfflineData([]);
  };

  // Listen for online event to sync data
  useEffect(() => {
    const handleOnline = async () => {
      alert("Internet connection restored. Syncing data to server...");
      await syncDataToServer();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <div className="form-container">
      <h1 className="form-header">User Form</h1>
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
          <h2>Synced Data (Online)</h2>
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
          <h2>Offline Data</h2>
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

export default Form;
