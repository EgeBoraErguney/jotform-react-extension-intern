import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

const Login = ({changeShow}) => {
    const cookies = new Cookies();

    function loginFunction() {
      window['JF'].login(
        function success(){
            cookies.set('apiKey', window['JF'].getAPIKey());
            changeShow("login",window['JF'].getAPIKey());
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