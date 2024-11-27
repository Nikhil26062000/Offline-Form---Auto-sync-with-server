export const saveDataToIndexedDB = (storeName, data) => {
    const dbPromise = indexedDB.open('my-database', 1);
  
    dbPromise.onupgradeneeded = () => {
      const db = dbPromise.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    };
  
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.add(data);
  
      tx.oncomplete = () => {
        console.log('Data saved to IndexedDB!');
      };
  
      tx.onerror = (event) => {
        console.error('Error saving to IndexedDB:', event.target.error);
      };
    };
  
    dbPromise.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
    };
  };

  
export const getAllDataFromIndexedDB = (storeName) => {
    return new Promise((resolve, reject) => {
      const dbPromise = indexedDB.open('my-database', 1);
  
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();
  
        request.onsuccess = () => {
            alert("get the data");
          resolve(request.result);
        };
  
        request.onerror = (event) => {
          reject(event.target.error);
        };
      };
  
      dbPromise.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };



  export const deleteDataFromIndexedDB = (storeName, id) => {
    const dbPromise = indexedDB.open('my-database', 1);
  
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.delete(id);
  
      tx.oncomplete = () => {
        console.log(`Data with id ${id} deleted from IndexedDB.`);
      };
  
      tx.onerror = (event) => {
        console.error('Error deleting data from IndexedDB:', event.target.error);
      };
    };
  };
  
  export const updateDataInIndexedDB = async (storeName, updatedItem) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("my-database", 1);
      request.onerror = (event) => reject("Error opening database");
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
  
        store.put(updatedItem);
        transaction.oncomplete = () => resolve("Data updated successfully");
        transaction.onerror = () => reject("Error updating data");
      };
    });
  };
  