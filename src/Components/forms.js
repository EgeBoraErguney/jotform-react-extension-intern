/*global chrome*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";

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

const Forms = () => {
  const apiKey = localStorage.getItem("apiKey");
  const [formId, setFormId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [url, setUrl] = useState("");
  const [searchValue, setSearchValue] = useState("null");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    GetFormsAtTheBeginning();
  }, []);

  useEffect(() => {
    UpdateActiveTabUrl();
    UpdateFilteredSubmissions(searchValue);
  }, [submissions, formId]);

  function GetFormInputs(tabID) {
    chrome.tabs.sendMessage(tabID, {action: "getFormData"}, function(response) {
      if(response && response.data && response.data.username){
        setUserName(response.data.username)
      }
      if(response && response.data && response.data.password){
        setPassword(response.data.password);
      }
    });
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
        /*
        "questions[0][type]": "control_textbox",
        "questions[0][text]": "usrnm",
        "questions[0][order]": 0,
        "questions[0][name]": "usrnm",
        "questions[1][type]": "control_textbox",
        "questions[1][text]": "psswrd",
        "questions[1][order]": 1,
        "questions[1][name]": "psswrd",
        "questions[2][type]": "control_textbox",
        "questions[2][text]": "url",
        "questions[2][order]": 2,
        "questions[2][name]": "url",
        "questions[2][validation]": "Url",
        */
        "properties[title]": "Jotform_Password_Manager",
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    };
    axios(postFormData)
      .then((resp) => {
        setFormId(resp.data.content.id);
        PutAfterPostFunction(resp.data.content.id);
        //PutEncryptedProperty(resp.data.content.id);
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
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName && password && url) {
      const account = { userName, password, url };
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

  return (
    <>
      <Typography mt={2} mb={2} variant="h4">
        Password Manager
      </Typography>
      <Typography pt={1} mt={1}>
        <TextField
          label="Username"
          variant="outlined"
          name="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </Typography>
      <Typography pt={1} mt={1}>
        <TextField
          label="Password"
          variant="outlined"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Typography>
      <Typography pt={2} mt={1} mb={2}>
        <TextField
          style={{ width: 400 }}
          label="Url"
          variant="outlined"
          name="url"
          disabled
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </Typography>

      <Button variant="contained" onClick={handleSubmit}>
        Add
      </Button>
      <Typography pt={2} mt={1} mb={2}>
        <TextField
          style={{ width: 400 }}
          label="Search Url"
          variant="outlined"
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
        onClick={() => {
          setSearchValue("");
          UpdateFilteredSubmissions("");
        }}
      >
        Clear
      </Button>
      <Box
        sx={{
          width: "60%",
          margin: "auto",
          alignItems: "center",
          pl: 1,
          pb: 1,
        }}
      >
        <IconButton
          sx={{ mt: 1 }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {!showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
        {filteredSubmissions.map((item) => {
          return (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <IconButton
                  onClick={() => deleteSubmission(item.id)}
                  sx={{ float: "right" }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    chrome.tabs.create({
                      url: "https://www.jotform.com/tables/" + formId,
                    });
                  }}
                  sx={{ float: "right" }}
                >
                  <EditIcon />
                </IconButton>
                <Typography mt={5} mb={2} variant="h6">
                  {item.answers[3].answer}{" "}
                </Typography>
                <Typography>username: {item.answers[1].answer} </Typography>
                <Typography>
                  password: {showPassword ? item.answers[2].answer : "***"}{" "}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </>
  );
};

export default Forms;
