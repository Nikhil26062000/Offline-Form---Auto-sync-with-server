import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { deleteDataFromIndexedDB, getAllDataFromIndexedDB } from './utils/indexedDB';

const storeName = 'form-data'; // Specify the IndexedDB store name
let isSyncing = false; // Flag to prevent duplicate syncs

async function syncOfflineData() {
  if (isSyncing) return; // Prevent duplicate syncs if already syncing
  isSyncing = true;

  try {
    console.log('Syncing offline data...');
    const offlineData = await getAllDataFromIndexedDB(storeName);

    if (offlineData.length === 0) {
      console.log('No offline data to sync.');
      return;
    }

    for (const data of offlineData) {

        console.log('Syncing data:', data);

          console.log(`Successfully synced data with ID ${data.id}`);
           deleteDataFromIndexedDB(storeName, data.id);
       
    }
  } catch (error) {
    console.error('Error during sync process:', error);
  } finally {
    isSyncing = false;
  }
}

// Add event listener to sync data when coming back online
window.addEventListener('online', async () => {
  console.log('Internet connection restored. Syncing offline data...');
  await syncOfflineData();
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
