import './App.css';
import { useState, useEffect } from 'react';
import FormContainer from './components/formContainer/formContainer';
import Login from './components/login/login';
import Navbar from './components/Index/navbar';
import TwoFactor from './components/2fa/TwoFactor'
import {Routes, Route} from "react-router-dom";
const axios = require('axios')

function App() {
  axios.defaults.withCredentials = true
  return (
    <div className="App">
      <Routes>
        <Route path = "/" element = {<Navbar />}></Route>
        <Route path = "/eMandate" element = {<FormContainer />}></Route>
        <Route path = "/login" element = {<Login />}></Route>
        <Route path = "/register2fa" element = {<TwoFactor />}></Route>
      </Routes>
    </div>
  );
}

export default App;
