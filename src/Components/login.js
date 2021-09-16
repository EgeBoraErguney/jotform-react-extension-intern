import React, { useState, useEffect } from 'react';

const Login = () => {
    const [apiKey, setApiKey] = useState("");

    function loginFunction() {
      window['JF'].login(
        function success(){
            setApiKey(window['JF'].getAPIKey());
            console.log(window['JF'].getAPIKey());
            console.log(apiKey);
        },
        function error(){
          window.alert("Could not authorize user");
        }
      ); 
    };

    return (
        <>
            <h1>Hello</h1>
            <h2>Welcome to Jotform Password Manager</h2>
            <h4>Let's Login to Save Your Password</h4>
            <button onClick={loginFunction}>
                login
            </button>
        </>
    )
}

export default Login;