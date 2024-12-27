import React from 'react';
import './App.css';
import Form from './Form';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Pass the component as a reference, not a variable */}
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<Home />} />
          <Route path='/form' element={<Form />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
