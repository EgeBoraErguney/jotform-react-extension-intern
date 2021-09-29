import React, { useState, useEffect } from "react";
import qs from "qs";
import axios from "axios";


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
      <Box  pt={2} pb={2}>

          <Typography variant="h5" pt={4} >
            Jotform Password Manager
          </Typography>
          <Typography variant="h6" pt={4} mt={2}>
            Please sign in to your Jotform account
          </Typography>
          <Typography pt={2} mt={2}>
            <TextField
              label="Username"
              variant="outlined"
              name="username"
              value={formData.username}
              onChange={(e) => handleChange(e)}
            />
          </Typography>
          <Typography mt={2}>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleChange(e)}
            />
          </Typography>
          <Typography pb={6} mt={2}>
            <Button variant="contained" onClick={loginFunction}>
              login
            </Button>
          </Typography>
        
      </Box>
    </>
  );
};

export default Login;
