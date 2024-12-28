


Project Name: Offline-Form---Auto-sync-with-server
Overview
This project consists of two forms that allow users to submit data. The project is in the master branch. The goal is to save form data in IndexedDB and ensure the data is synced with the server, even when there is no internet connection.

Workflow
When the internet is available:

Form data is saved in IndexedDB.
The data is sent to the server via API calls.
When the internet is not available:

Form data is saved in IndexedDB.

Once the internet connection is restored, the application automatically fetches the data from IndexedDB and sends it to the server.

Note: As the actual API is not yet available, the forms are using dummy APIs to simulate the data submission. Once the actual API is ready, these dummy API endpoints will be replaced with the real ones.

Features
Two forms: The project currently has two forms to collect user data.
Offline functionality: If the internet is unavailable, the form data is saved in IndexedDB and is sent to the server once the internet is back.
IndexedDB storage: Data is stored locally in the browser using IndexedDB.
Dummy API calls: Since the actual API is unavailable, the forms are currently calling different dummy APIs for testing.

How It Works
Saving to IndexedDB:

When a user submits the form, the data is first saved in IndexedDB using the browser’s local storage API.
If the internet is available, the data is immediately sent to the server.
Handling Internet Connectivity:

The application continuously monitors the network status.
If there is no internet, the form data remains saved in IndexedDB and will be uploaded as soon as the internet connection is restored.
Dummy API for Testing:

Since the actual API is not yet available, the application calls dummy API endpoints (simulated server calls) for testing purposes.
These dummy endpoints will be replaced with real API URLs once the server-side API is ready.
Setup
To get started with the project locally, follow these steps:


License
This project is licensed under the MIT License - see the LICENSE file for details.
