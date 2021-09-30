import React, { useState, useEffect } from "react";
import qs from "qs";
import axios from "axios";
import logo from "./jotform-logo.png";

import {
  Button,
  TextField,
  Stack,
  Box,
  Typography,
  Card,
  Container,
  Paper,
} from "@mui/material";

const Login = ({ changeShow }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
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

  function loginFunction(event) {
    event.preventDefault();
    const postformData = {
      method: "post",
      url: "https://api.jotform.com/user/login",
      data: qs.stringify({
        username: formData.username,
        password: formData.password,
        appName: "Extension",
        access: "full",
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    };
    axios(postformData)
      .then(function (response) {
        localStorage.setItem("apiKey", response.data.content.appKey);
        changeShow("login", response.data.content.appKey);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  return (
    <>
      <img  src={logo} />
      <Box  pt={1} pb={1}>

          <Typography variant="h5" pt={1} >
            Jotform Password Manager
          </Typography>
          <Typography variant="h6" pt={1} mt={1}>
            Please sign in to your Jotform account
          </Typography>
          <Typography pt={1} mt={1}>
            <TextField
              label="Username"
              variant="outlined"
              name="username"
              value={formData.username}
              onChange={(e) => handleChange(e)}
            />
          </Typography>
          <Typography mt={1}>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleChange(e)}
            />
          </Typography>
          <Typography pb={1} mt={1}>
            <Button variant="contained" onClick={loginFunction}>
              login
            </Button>
          </Typography>
        
      </Box>
    </>
  );
};

export default Login;
