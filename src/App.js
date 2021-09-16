import "./App.css";
import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import qs from "qs";
import { Helmet } from "react-helmet";

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [userData, setUserData] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [apiKey, setApiKey] = useState("");


  function handleChange(event) {
    setFormData({
      username:
        event.target.name === "username"
          ? event.target.value
          : formData.username,
      password:
        event.target.name === "password"
          ? event.target.value
          : formData.password,
    });
  }
  function loginFunction() {
    window['JF'].login(
      function success(){
          setApiKey(window['JF'].getAPIKey());
          console.log(window['JF'].getAPIKey());
      },
      function error(){
        window.alert("Could not authorize user");
      }
  ); 
  }

  return (
    <div className="App">
      <button onClick={()=>loginFunction()}>Login</button>
      {apiKey}
    </div>
  );
}

export default App;
