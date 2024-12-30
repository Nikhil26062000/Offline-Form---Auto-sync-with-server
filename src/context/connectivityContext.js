// // src/context/ConnectivityContext.js
// import React, { createContext, useState, useEffect } from "react";
// import {
//   deleteDataFromIndexedDB,
//   fetchAllStoresWithValues,
// } from "../utils/indexedDB";

// // Create the context
// const ConnectivityContext = createContext();

// // Create a provider component
// const ConnectivityProvider = ({ children }) => {
//   const [isOnline, setIsOnline] = useState(null); // Initial state based on browser's online status
//   const [formDetail, setFormDetail] = useState(null);

//   useEffect(() => {
//     async function isOn() {
//       try {
//         const response = await fetch("https://www.google.com", {
//           method: "HEAD",
//           mode: "no-cors",
//         });
//         return true; // Internet is available
//       } catch (error) {
//         return false; // No internet
//       }
//     }

//     isOn().then((status) => {
//       if (status) {
//         setIsOnline(status);

//       } else {
//         setIsOnline(status);
//       }
//     });
//   },[]);
//   const fetchFormDetails = async () => {
//     const data = await fetch(`${process.env.PUBLIC_URL}/formsDetail.json`);
//     const jsonData = await data.json();
//     // console.log(jsonData);
//     setFormDetail(jsonData);
//   };

//   useEffect(() => {
//     fetchFormDetails();

//     const initialCheck = async () => {
//       try {
//         console.log("Application start... checking indexeddb");

//         const data = await fetchAllStoresWithValues("my-db");
//         // console.log("Database stores with values:", data);

//         // Loop through each store
//         for (const [storeName, storeData] of Object.entries(data)) {
//           // console.log(`Store: ${storeName}`);

//           // Loop through each item in the store
//           storeData.forEach((item, index) => {
//             //   console.log(`  Item ${index + 1}:`, item);
//           });

//           let is_synced_false_data = storeData.filter(
//             (item, index) => item.isSynced === false
//           );
//           console.log(
//             `is_synced_false_data data for ${storeName} is :`,
//             is_synced_false_data
//           );

//           if (formDetail && Object.keys(formDetail)?.includes(storeName)) {
//             //   console.log("Store is present");
//             // console.log(formDetail[storeName].api);
//             try {
//               const data = await fetch(`${formDetail[storeName].api}`);
//               const api_data = await data.json();
//               console.log("api data", api_data);
//             } catch (error) {
//               console.log(error);
//             }
//           }
//           storeData.forEach((item, index) => {
//             deleteDataFromIndexedDB(storeName, item.id);
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     initialCheck();
//   }, []);

//   window.addEventListener(
//     "online",
//     async () => {
//       setIsOnline(true);
//       try {
//         const data = await fetchAllStoresWithValues("my-db");
//         console.log("Database stores with values:", data);

//         // Loop through each store
//         for (const [storeName, storeData] of Object.entries(data)) {
//           console.log(`Store: ${storeName}`);

//           // Loop through each item in the store
//           storeData.forEach((item, index) => {
//             console.log(`  Item ${index + 1}:`, item);
//           });

//           let is_synced_false_data = storeData.filter(
//             (item, index) => item.isSynced === false
//           );
//           console.log(
//             `is_synced_false_data data for ${storeName} is :`,
//             is_synced_false_data
//           );

//           if (Object.keys(formDetail).includes(storeName)) {
//             console.log("Store is present");
//             console.log(formDetail[storeName].api);
//             //   try {
//             //     const data = await fetch(`${formDetail[storeName].api}`);
//             //     const api_data = await data.json();
//             //     console.log("api data", api_data);
//             //   } catch (error) {
//             //     console.log(error);
//             //   }
//           }
//           storeData.forEach((item, index) => {
//             deleteDataFromIndexedDB(storeName, item.id);
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     },
//     []
//   );

//   window.addEventListener("offline", () => {
//     console.log("Offline");
//     setIsOnline(false);
//   });

  

//   return (
//     <ConnectivityContext.Provider value={{ isOnline, formDetail }}>
//       {children}
//     </ConnectivityContext.Provider>
//   );
// };

// export { ConnectivityProvider, ConnectivityContext };


import React, { createContext, useState, useEffect } from "react";
import {
  deleteDataFromIndexedDB,
  fetchAllStoresWithValues,
} from "../utils/indexedDB";

// Create the context
const ConnectivityContext = createContext();

// Create a provider component
const ConnectivityProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(); // Initialize with browser's online status
  const [formDetail, setFormDetail] = useState(null);

  const fetchFormDetails = async () => {
    try {
      const data = await fetch(`${process.env.PUBLIC_URL}/formsDetail.json`);
      const jsonData = await data.json();
      setFormDetail(jsonData);
    } catch (error) {
      console.error("Error fetching form details:", error);
    }
  };

  useEffect(() => {
    fetchFormDetails(); // Only call once when component mounts

    // Function to check online status through fetch request
    async function checkOnlineStatus() {
      try {
        const response = await fetch("https://www.google.com", { method: "HEAD", mode: "no-cors" });
        return true;
      } catch (error) {
        return false;
      }
    }

    checkOnlineStatus().then((status) => {
        if (status){
            setIsOnline(status)
            console.log("you are online");
            
        }else{
            console.log("You are offline");
            
        }
    });

  }, []); // Run only once on mount

  useEffect(() => {
    const initialCheck = async () => {
       
      if (!formDetail) return; // Ensure formDetail is populated before proceeding

      try {
        console.log("-------- Application start... checking indexeddb for the first time -----------");

        const data = await fetchAllStoresWithValues("my-db");
        console.log("total data in indexedDB", data);
        

        // Loop through each store
        for (const [storeName, storeData] of Object.entries(data)) {
          console.log(`Store: ${storeName}`);

          let is_synced_false_data = storeData.filter(
            (item) => item.isSynced === false
          );
          console.log(`Data ready to go on server for ${storeName}:`, is_synced_false_data);

          if (formDetail && Object.keys(formDetail).includes(storeName)) {
            // try {
            //   const apiData = await fetch(`${formDetail[storeName].api}`);
            //   const apiJson = await apiData.json();
            //   console.log("API data:", apiJson);
            // } catch (error) {
            //   console.log("Error fetching API data:", error);
            // }

            console.log(`Api called for store ${storeName}`);
            
          }

          storeData.forEach((item) => {
            // deleteDataFromIndexedDB(storeName, item.id);
          });
        }
      } catch (error) {
        console.error("Error fetching data from IndexedDB:", error);
      }
    };

    initialCheck();
  }, [formDetail]); // Runs when formDetail is updated

  const handleOnline = async () => {
    setIsOnline(true);
    try {
      const data = await fetchAllStoresWithValues("my-db");
      console.log("Database stores with values:", data);

      for (const [storeName, storeData] of Object.entries(data)) {
        let is_synced_false_data = storeData.filter(
          (item) => item.isSynced === false
        );
        console.log(`is_synced_false_data for ${storeName}:`, is_synced_false_data);

        if (formDetail && Object.keys(formDetail).includes(storeName)) {
          console.log("Store is present");
          console.log(formDetail[storeName].api);
        }

        storeData.forEach((item) => {
        //   deleteDataFromIndexedDB(storeName, item.id);
        });
      }
    } catch (error) {
      console.error("Error fetching data on online event:", error);
    }
  };

  const handleOffline = () => {
    console.log("Offline");
    setIsOnline(false);
  };

  useEffect(() => {
    // Add event listeners for online and offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []); // Empty dependency array means this runs only once on mount

  return (
    <ConnectivityContext.Provider value={{ isOnline, formDetail }}>
      {children}
    </ConnectivityContext.Provider>
  );
};

export { ConnectivityProvider, ConnectivityContext };
