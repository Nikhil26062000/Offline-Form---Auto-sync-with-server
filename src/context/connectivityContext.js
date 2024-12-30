// src/context/ConnectivityContext.js
import React, { createContext, useState, useEffect } from 'react';
import { deleteDataFromIndexedDB, fetchAllStoresWithValues } from '../utils/indexedDB';

// Create the context
const ConnectivityContext = createContext();

// Create a provider component
const ConnectivityProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Initial state based on browser's online status
  const [formDetail,setFormDetail] = useState(null);



const fetchFormDetails = async () => {
    const data = await fetch(`${process.env.PUBLIC_URL}/formsDetail.json`);
    const jsonData = await data.json();
    console.log(jsonData);
    setFormDetail(jsonData);
  };




useEffect(()=>{
fetchFormDetails();

  const initialCheck = async() =>{
    try {
      console.log("Application start... checking indexeddb");
      
      const data = await fetchAllStoresWithValues("my-db");
      // console.log("Database stores with values:", data);
  
      // Loop through each store
      for (const [storeName, storeData] of Object.entries(data)) {
        console.log(`Store: ${storeName}`);
  
        // Loop through each item in the store
        storeData.forEach((item, index) => {
          console.log(`  Item ${index + 1}:`, item);
        });
  
        let is_synced_false_data = storeData.filter(
          (item, index) => item.isSynced === false
        );
        console.log(
          `is_synced_false_data data for ${storeName} is :`,
          is_synced_false_data
        );
  
        if (formDetail && Object.keys(formDetail)?.includes(storeName)) {
          console.log("Store is present");
          console.log(formDetail[storeName].api);
          try {
            const data = await fetch(`${formDetail[storeName].api}`);
            const api_data = await data.json();
            console.log("api data", api_data);
          } catch (error) {
            console.log(error);
          }
        }
        storeData.forEach((item, index) => {
          deleteDataFromIndexedDB(storeName, item.id);
        });
  
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

  }

  initialCheck();

},[])

window.addEventListener("online", async () => {
    // getAllStoreNames('my-db')
    // .then((storeNames) => {
    //   console.log('Store names:', storeNames);
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
  
    try {
      const data = await fetchAllStoresWithValues("my-db");
      console.log("Database stores with values:", data);
  
      // Loop through each store
      for (const [storeName, storeData] of Object.entries(data)) {
        console.log(`Store: ${storeName}`);
  
        // Loop through each item in the store
        storeData.forEach((item, index) => {
          console.log(`  Item ${index + 1}:`, item);
        });
  
        let is_synced_false_data = storeData.filter(
          (item, index) => item.isSynced === false
        );
        console.log(
          `is_synced_false_data data for ${storeName} is :`,
          is_synced_false_data
        );
  
        if (Object.keys(formDetail).includes(storeName)) {
          console.log("Store is present");
          console.log(formDetail[storeName].api);
        //   try {
        //     const data = await fetch(`${formDetail[storeName].api}`);
        //     const api_data = await data.json();
        //     console.log("api data", api_data);
        //   } catch (error) {
        //     console.log(error);
        //   }
        }
        storeData.forEach((item, index) => {
          deleteDataFromIndexedDB(storeName, item.id);
        });
  
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },[]);
  
  
  window.addEventListener('online', () => {
    console.log("Online");
    
  })
  window.addEventListener('offline', () => {
    console.log("Offline");
    
  })

  return (
    <ConnectivityContext.Provider value={{ isOnline , formDetail}}>
      {children}
    </ConnectivityContext.Provider>
  );
};

export { ConnectivityProvider, ConnectivityContext };
