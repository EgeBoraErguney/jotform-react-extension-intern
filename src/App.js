import "./App.css";
import React, { useEffect, useState } from "react";
import Login from "./Components/login";
import Forms from "./Components/forms";

function App() {
  const [show, setShow] = useState("login");
  const [apiKey,setApiKey] = useState(localStorage.getItem("apiKey"));

  useEffect(() => {
    if (apiKey) {
      setShow("forms");
    }
  }, [show, apiKey, setShow]);

  const changeShow = (page,apiKey) => {
    setShow(page);
    setApiKey(apiKey);
  };

  return (
    <div className="App">
      {show === "login" && <Login changeShow={changeShow} />}
      {show === "forms" && <Forms />}
    </div>
  );
}

export default App;
