const dbName = "my-db"; // Fixed database name

// Initialize or update IndexedDB dynamically
export const initializeDB = async (storeName) => {
  return new Promise((resolve, reject) => {
    const dbPromise = indexedDB.open(dbName);

    dbPromise.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create the object store if it doesn't exist
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
      }
    };

    dbPromise.onsuccess = (event) => {
      const db = event.target.result;

      // Check if store exists; if not, recreate with a higher version
      if (!db.objectStoreNames.contains(storeName)) {
        db.close(); // Close current DB
        const version = db.version + 1; // Increment version to trigger onupgradeneeded
        const upgradeRequest = indexedDB.open(dbName, version);

        upgradeRequest.onupgradeneeded = (event) => {
          const upgradedDB = event.target.result;
          if (!upgradedDB.objectStoreNames.contains(storeName)) {
            upgradedDB.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
          }
        };

        upgradeRequest.onsuccess = (event) => resolve(event.target.result);
        upgradeRequest.onerror = (event) => reject(event.target.error);
      } else {
        resolve(db);
      }
    };

    dbPromise.onerror = (event) => reject(event.target.error);
  });
};

// Save data to IndexedDB dynamically
export const saveDataToIndexedDB = async (storeName, data) => {
  const db = await initializeDB(storeName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    // Ensure the data object doesn't already have an id if autoIncrement is true
    if ("id" in data) {
      data.id = undefined; // Clear existing id to avoid conflict
    }

    const request = store.add(data);

    request.onsuccess = () => resolve("Data saved successfully!");
    request.onerror = (event) => reject(event.target.error);
  });
};

// Get all data from IndexedDB dynamically
export const getAllDataFromIndexedDB = async (storeName) => {
  const db = await initializeDB(storeName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};


// Update data in IndexedDB dynamically
export const updateDataInIndexedDB = async (storeName, updatedItem) => {
  const db = await initializeDB(storeName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.put(updatedItem);

    request.onsuccess = () => resolve("Data updated successfully!");
    request.onerror = (event) => reject(event.target.error);
  });
};

// Delete data from IndexedDB dynamically
export const deleteDataFromIndexedDB = async (storeName, id) => {
  const db = await initializeDB(storeName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve(`Data with id ${id} deleted successfully.`);
    request.onerror = (event) => reject(event.target.error);
  });
};


export const getAllStoreNames = (dbName) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const storeNames = Array.from(db.objectStoreNames); // Convert DOMStringList to Array
      db.close(); // Close the database connection
      resolve(storeNames);
    };

    request.onerror = (event) => {
      reject(`Error opening database: ${event.target.error}`);
    };
  });
};



export const fetchAllStoresWithValues = (dbName) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const storeNames = Array.from(db.objectStoreNames);
      const results = {};

      // Process each store
      let remainingStores = storeNames.length;

      if (remainingStores === 0) {
        resolve(results); // Resolve immediately if there are no stores
        db.close();
        return;
      }

      storeNames.forEach((storeName) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          results[storeName] = getAllRequest.result;
          remainingStores--;

          if (remainingStores === 0) {
            resolve(results); // Resolve when all stores are processed
            db.close();
          }
        };

        getAllRequest.onerror = () => {
          reject(`Failed to fetch data from store: ${storeName}`);
          db.close();
        };
      });
    };

    request.onerror = (event) => {
      reject(`Error opening database: ${event.target.error}`);
    };
  });
};

