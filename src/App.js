import React from 'react';
import logo from './logo.svg';
import './App.css';
import Form from './Form';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Form2 from './Form2';
import Home from './Home';

function App() {
  return (
   <>
    
    <Router>
      <Routes>
      <Route path="/" element={<Home/>}/>

        <Route path="/form" element={<Form/>}/>
        <Route path="/form2" element={<Form2/>}/>

      </Routes>
    </Router>
   </>
  );
}

export default App;
