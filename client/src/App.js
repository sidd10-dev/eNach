import './App.css';
import { useState, useEffect } from 'react';
import FormContainer from './components/formContainer/formContainer';
import Login from './components/login/login';
// import Navbar from './components/Index/navbar';
import TwoFactor from './components/2fa/TwoFactor'
import Logout from './components/logout/logout';
import {Routes, Route} from "react-router-dom";
import Logs from './components/logs/logs';
const axios = require('axios')

function App() {
  axios.defaults.withCredentials = true
  return (
    <div className="App">
      <Routes>
        {/* <Route path = "/" element = {<Navbar />}></Route> */}
        <Route path = "/eMandate" element = {<FormContainer />}></Route>
        <Route path = "/" element = {<Login />}></Route>
        <Route path = "/logout" element = {<Logout />}></Route>
        <Route path = "/register2fa" element = {<TwoFactor />}></Route>
        <Route path = "/logs" element = {<Logs />}></Route>
      </Routes>
    </div>
  );
}

export default App;
