import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { deleteDataFromIndexedDB, fetchAllStoresWithValues, getAllDataFromIndexedDB, getAllStoreNames } from './utils/indexedDB';

// const storeName = 'school-data'; // Specify the IndexedDB store name
// let isSyncing = false; // Flag to prevent duplicate syncs

// async function syncOfflineData() {
//   if (isSyncing) return; // Prevent duplicate syncs if already syncing
//   isSyncing = true;

//   try {
//     console.log('Syncing offline data...');
//     const offlineData = await getAllDataFromIndexedDB(storeName);

//     if (offlineData.length === 0) {
//       console.log('No offline data to sync.');
//       return;
//     }

//     for (const data of offlineData) {

//         console.log('Syncing data:', data);

//           console.log(`Successfully synced data with ID ${data.id}`);
//           //  deleteDataFromIndexedDB(storeName, data.id);
       
//     }
//   } catch (error) {
//     console.error('Error during sync process:', error);
//   } finally {
//     isSyncing = false;
//   }
// }

// Add event listener to sync data when coming back online
// window.addEventListener('online', async () => {
//   console.log('Message from indexeddb Syncing offline data...');
//   await syncOfflineData();
// });

window.addEventListener('online', async () => {
  // getAllStoreNames('my-db')
  // .then((storeNames) => {
  //   console.log('Store names:', storeNames);
  // })
  // .catch((error) => {
  //   console.error(error);
  // });

  try {
    const data = await fetchAllStoresWithValues('my-db');
    console.log('Database stores with values:', data);

    // Loop through each store
    for (const [storeName, storeData] of Object.entries(data)) {
      console.log(`Store: ${storeName}`);

      
      // Loop through each item in the store
      storeData.forEach((item, index) => {
        console.log(`  Item ${index + 1}:`, item);
      });

      let is_synced_false_data = storeData.filter((item, index) => item.isSynced === false)
      console.log(`is_synced_false_data data for ${storeName} is :`, is_synced_false_data);
      
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Enable service worker for offline functionality
serviceWorkerRegistration.register();

// Measure app performance
reportWebVitals();

//! with help of json schema we can automate the offline online syncing of data
// const data = [
//   {
//     formName: 'form1',
//     api: '/api/form1',
//   },
//   {
//     formName: 'form2',
//     api: '/api/form2',
//   }
// ]
























