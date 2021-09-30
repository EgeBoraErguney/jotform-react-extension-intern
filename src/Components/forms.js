/*global chrome*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";
import logo from "./jotform-logo.png";

import {
  Button,
  TextField,
  Stack,
  Box,
  Typography,
  Card,
  Container,
  CardContent,
  IconButton,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CircleIcon from "@mui/icons-material/AddCircle";
import HttpsRoundedIcon from '@mui/icons-material/HttpsRounded';

const Forms = () => {
  const apiKey = localStorage.getItem("apiKey");
  const [formId, setFormId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [url, setUrl] = useState("");
  const [searchValue, setSearchValue] = useState("null");
  const [showPassword, setShowPassword] = useState([]);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isPressedAddButton, setIsPressedAddButton] = useState(false);
  const [showEncryption, setShowEncryption] = useState(false);

  useEffect(() => {
    GetFormsAtTheBeginning();
  }, []);

  useEffect(() => {
    UpdateActiveTabUrl();
    UpdateFilteredSubmissions(searchValue);
  }, [submissions, formId]);

  function fillFormInputs(username, password) {
    chrome.tabs &&
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (
          typeof tabs !== "undefined" &&
          tabs &&
          typeof tabs[0] !== "undefined" &&
          tabs[0]
        ) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "fillFormData", username: username, password: password },
            function (response) {
              if (response && response.data) {
                console.log(response.data);
              }
            }
          );
        }
      });
  }

  function GetFormInputs(tabID) {
    chrome.tabs.sendMessage(
      tabID,
      { action: "getFormData" },
      function (response) {
        if (response && response.data && response.data.username) {
          setUserName(response.data.username);
        }
        if (response && response.data && response.data.password) {
          setPassword(response.data.password);
        }
      }
    );
  }

  function UpdateActiveTabUrl() {
    chrome.tabs &&
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (
          typeof tabs !== "undefined" &&
          tabs &&
          typeof tabs[0] !== "undefined" &&
          tabs[0]
        ) {
          setUrl(tabs[0].url);
          GetFormInputs(tabs[0].id);
          if (searchValue === "null") {
            setSearchValue(new URL(tabs[0].url).hostname);
          }
        }
      });
  }

  function UpdateFilteredSubmissions(searchValue) {
    let result = [];
    result = submissions.filter((item) => {
      if (
        typeof item !== "undefined" &&
        item &&
        typeof item.answers[3] !== "undefined" &&
        item.answers[3] &&
        typeof item.answers[3].answer !== "undefined" &&
        item.answers[3].answer
      ) {
        return (
          item.answers[3].answer
            .toLowerCase()
            .search(searchValue.toLowerCase()) != -1
        );
      }
    });
    setFilteredSubmissions(result);
  }

  function GetFormsAtTheBeginning() {
    const getFormData = {
      method: "get",
      url: "https://api.jotform.com/user/forms?apiKey=" + apiKey,
    };
    axios(getFormData)
      .then((resp) => {
        if (
          resp.data.content.filter(
            (obj) => obj.title === "Jotform_Password_Manager"
          ).length < 1
        ) {
          PostFunction();
        } else {
          setFormId(
            resp.data.content.filter(
              (obj) => obj.title === "Jotform_Password_Manager"
            )[0].id
          );
          localStorage.setItem(
            "formId",
            resp.data.content.filter(
              (obj) => obj.title === "Jotform_Password_Manager"
            )[0].id
          );
          GetSubmissions(
            resp.data.content.filter(
              (obj) => obj.title === "Jotform_Password_Manager"
            )[0].id
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function PutAfterPostFunction(formId) {
    const putFormData = {
      method: "put",
      url:
        "https://api.jotform.com/form/" +
        formId +
        "/questions?apiKey=" +
        apiKey,
      data: {
        questions: {
          0: {
            type: "control_textbox",
            text: "usrnm",
            order: "0",
            name: "usrnm",
          },
          1: {
            type: "control_textbox",
            text: "pssword",
            order: "1",
            name: "pssword",
          },
          2: {
            type: "control_textbox",
            text: "url",
            order: "2",
            name: "url",
            validation: "Url",
          },
        },
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    };
    axios(putFormData)
      .then((resp) => {
        console.log(resp);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function PostFunction() {
    const postFormData = {
      method: "post",
      url: "https://api.jotform.com/user/forms?apiKey=" + apiKey,
      data: qs.stringify({
        "properties[title]": "Jotform_Password_Manager",
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    };
    axios(postFormData)
      .then((resp) => {
        setFormId(resp.data.content.id);
        localStorage.setItem("formId", resp.data.content.id);
        PutAfterPostFunction(resp.data.content.id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function GetSubmissions(formId) {
    const getFormData = {
      method: "get",
      url:
        "https://api.jotform.com/form/" +
        formId +
        "/submissions?apiKey=" +
        apiKey,
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    };
    axios(getFormData)
      .then((resp) => {
        setSubmissions(resp.data.content);
        GetProperties(formId);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName && password && url) {
      const addSubmission = {
        method: "post",
        url:
          "https://api.jotform.com/form/" +
          formId +
          "/submissions?apiKey=" +
          apiKey,
        data: qs.stringify({
          "submission[1]": userName,
          "submission[2]": password,
          "submission[3]": url,
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      };
      axios(addSubmission)
        .then((resp) => {
          GetSubmissions(formId);
          UpdateActiveTabUrl(searchValue);
        })
        .catch((error) => {
          console.log(error);
        });
      setUserName("");
      setPassword("");
    } else {
      console.log("empty values");
    }
  };

  const deleteSubmission = (subId) => {
    const deleteSubmission = {
      method: "delete",
      url: "https://api.jotform.com/submission/" + subId + "?apiKey=" + apiKey,
    };
    axios(deleteSubmission)
      .then((resp) => {
        console.log(resp);
        GetSubmissions(formId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function GetProperties(formId) {
    const properties = {
      method: "get",
      url:
        "https://api.jotform.com/form/" +
        formId +
        "/properties?apiKey=" +
        apiKey,
    };
    axios(properties)
      .then((resp) => {
        console.log(resp.data.content.isEncrypted);
        if (resp.data.content.isEncrypted === "Yes") {
          setIsEncrypted(true);
        } else {
          setIsEncrypted(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <img src={logo} />

      <Typography mt={1} mb={1} variant="h5">
        Password Manager
      </Typography>
      <Box
        sx={{
          height: "20%",
          width: "96%",
          margin: "auto",
          alignItems: "center",
        }}
      >
        {filteredSubmissions.map((item) => {
          return (
            <Card key={item.id} sx={{ mt: 0.5, p: 0.5 }}>
              <CardContent
                sx={{
                  m: 0,
                  p: 0.5,
                  "&:last-child": {
                    paddingBottom: 0.5,
                  },
                }}
              >
                <IconButton
                  onClick={() => deleteSubmission(item.id)}
                  sx={{ float: "right" }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => {
                    chrome.tabs.create({
                      url: "https://www.jotform.com/tables/" + formId,
                    });
                  }}
                  sx={{ float: "right" }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  sx={{ float: "right" }}
                  onClick={() => {
                    if (showPassword.indexOf(item.id) === -1) {
                      setShowPassword([...showPassword, item.id]);
                    } else {
                      var array = [...showPassword];
                      array.splice(showPassword.indexOf(item.id), 1);
                      setShowPassword(array);
                    }
                  }}
                >
                  {showPassword.indexOf(item.id) !== -1 ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </IconButton>
                <Button
                  onClick={() =>
                    fillFormInputs(
                      item.answers[1].answer,
                      item.answers[2].answer
                    )
                  }
                  variant="primary"
                  sx={{ float: "right", p: 1 }}
                >
                  Fill
                </Button>
                <Typography mt={1} variant="subtitle2">
                  {item.answers[3].answer}{" "}
                </Typography>
                <Typography variant="caption">
                  username: {item.answers[1].answer}{" "}
                </Typography>
                <Typography variant="caption">
                  password:{" "}
                  {showPassword.indexOf(item.id) !== -1
                    ? item.answers[2].answer
                    : "***"}{" "}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
      <Typography pt={1} mt={1} mb={1}>
        <TextField
          style={{ width: 300 }}
          label="Search Url"
          variant="outlined"
          size="small"
          name="search"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            UpdateFilteredSubmissions(e.target.value);
          }}
        />
      </Typography>

      <Button
        variant="contained"
        size="small"
        onClick={() => {
          setSearchValue("");
          UpdateFilteredSubmissions("");
        }}
      >
        Clear
      </Button>
      <br />
      <IconButton
        sx={{ mt: 0.5 }}
        onClick={(event) => {
          event.target.parentNode.parentNode.removeChild(
            event.target.parentNode
          );
          setIsPressedAddButton(true);
        }}
      >
        <CircleIcon sx={{ fill: "green", width: "50px", height: "auto" }} />
        

      </IconButton>
      {isPressedAddButton ? (
        <>
          <Typography pt={1} mt={1}>
            <TextField
              style={{ width: 200 }}
              label="Username"
              variant="outlined"
              size="small"
              name="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Typography>
          <Typography pt={1}>
            <TextField
              style={{ width: 200 }}
              label="Password"
              variant="outlined"
              size="small"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Typography>
          <Typography pt={2} mb={1}>
            <TextField
              style={{ width: 300 }}
              label="Url"
              variant="outlined"
              size="small"
              name="url"
              disabled
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Typography>
          <Button variant="contained" size="small" onClick={handleSubmit}>
            Add New Item
          </Button>{" "}
        </>
      ) : (
        <></>
      )}

      <IconButton sx={{ mt: 0.5 }}>  
        <HttpsRoundedIcon sx={{ width: "50px", height: "auto" }}  onClick = {() => setShowEncryption(!showEncryption)}/>
      </IconButton>
      

      {showEncryption ?
            (isEncrypted ? (
              <Typography mt={2} mb={1} variant="body2">
                {" "}
                Your passwords are encrypted{" "}
              </Typography>
            ) : (
              <div>
                <Typography mt={2} mb={1} variant="body2">
                  {" "}
                  Your passwords are not encrypted. If you want to save your password
                  more securely, please follow this manual{" "}
                </Typography>
                <Button
                  sx={{ mb: 0.5 }}
                  variant="contained"
                  size="small"
                  onClick={() => {
                    chrome.tabs.create({
                      url: "https://www.jotform.com/help/344-encrypted-forms-and-how-to-use-them/",
                    });
                  }}
                >
                  How to Encrypt
                </Button>
              </div>
            )) :
            <></> 
      }

    </>
  );
};

export default Forms;
