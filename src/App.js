import "./App.css";
import React, { useEffect, useState } from "react";
import Login from "./Components/login";
import Forms from "./Components/forms";
import Cookies from "universal-cookie";

function App() {
  const [show, setShow] = useState("login");
  const cookies = new Cookies();
  const [apiKey,setApiKey] = useState(cookies.get("apiKey"));

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
