import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { deleteDataFromIndexedDB, getAllDataFromIndexedDB, updateDataInIndexedDB } from './utils/indexedDB';

const storeName = 'form-data'; // Specify the IndexedDB store name
let isSyncing = false; // Flag to prevent duplicate syncs

// async function syncOfflineData() {
//   if (isSyncing) return; // Prevent duplicate syncs if already syncing
//   isSyncing = true;

//   try {
//     console.log('Indexjs---->in try block Syncing offline data...');
//     const offlineData = await getAllDataFromIndexedDB(storeName);
//     console.log("This is offline data",offlineData);
    

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

const syncDataToServer = async () => {
    const data = await getAllDataFromIndexedDB(storeName);

    for (const item of data) {
      if (!item.isSynced) {
        console.log("item which is synced:false", item);
        
        try {


          // Update the item in IndexedDB to mark it as synced
          await updateDataInIndexedDB(storeName, { ...item, isSynced: true });
          console.log(`Synced data: ${item.name}`);
        } catch (error) {
          console.error("Failed to sync data:", item, error);
        }
        // deleteDataFromIndexedDB(storeName,item.id)

      }else{
           deleteDataFromIndexedDB(storeName, item.id);

      }
    }


  };

// Add event listener to sync data when coming back online
window.addEventListener('online', async () => {
  console.log('Indexjs-----> el runs');
  // await syncOfflineData();
  await syncDataToServer()
});

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
