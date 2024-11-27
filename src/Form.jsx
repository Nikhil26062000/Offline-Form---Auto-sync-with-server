import React, { useEffect, useState } from "react";
import {
  getAllDataFromIndexedDB,
  deleteDataFromIndexedDB,
  saveDataToIndexedDB,
} from "../src/utils/indexedDB";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: null, // For file input
  });

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

    // Check if online
    if (navigator.onLine) {
      // Send data to the server
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      saveDataToIndexedDB(storeName, formData);

      console.log("Data sent to server", formData);
    } else {
      // Save data to IndexedDB if offline
      saveDataToIndexedDB(storeName, formData);
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
    console.log("Prev data of idb", data);
    for (const item of data) {
      const formDataToSend = new FormData();
      formDataToSend.append("name", item.name);
      formDataToSend.append("email", item.email);
      if (item.image) {
        formDataToSend.append("image", item.image);
      }

      alert("data sync with server ");

      // Delete data from IndexedDB after successful sync
      deleteDataFromIndexedDB(storeName, item.id);
    }
  };

  // Listen for online event to sync data
  useEffect(() => {
    const handleOnline = async () => {
      alert("Internet connection restored. Syncing data to server...");
      await syncDataToServer();
    };

    // Add event listener for when the user comes online
    window.addEventListener("online", handleOnline);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

//   useEffect(() => {
//     window.addEventListener("online", () => {
//       alert("Online");
//     });
//   }, []);


  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Image:
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
