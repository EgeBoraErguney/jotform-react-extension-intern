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

const Forms = () => {
  const apiKey = localStorage.getItem("apiKey");
  const [formId, setFormId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [url, setUrl] = useState("");

  useEffect(() => {
    GetFormsAtTheBeginning();
  }, []);

  useEffect(() => {
    UpdateActiveTabUrl();
  }, [submissions, formId]);

  function UpdateActiveTabUrl() {
    chrome.tabs &&
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (tabs) {
          setUrl(tabs[0].url);
        }
      });
  }

  function OpenInNewTab(urlParam) {
    chrome.tabs.create({ url: urlParam });
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
      console.log(account);
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
          console.log(resp);
        })
        .catch((error) => {
          console.log(error);
        })
        .then((resp) => {
          GetSubmissions(formId);
        });
      setUserName("");
      setPassword("");
      setUrl("");
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
      <Box
        sx={{
          width: "40%",
          margin: "auto",
          alignItems: "center",
          pl: 1,
          pb: 1,
        }}
      >
        {submissions.map((item) => {
          return (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <IconButton sx={{ float: "right" }}>
                  <DeleteIcon onClick={() => deleteSubmission(item.id)} />
                </IconButton>
                <IconButton sx={{ float: "right" }}>
                  <EditIcon
                    onClick={() => {
                      OpenInNewTab("https://www.jotform.com/tables/" + formId);
                    }}
                  />
                </IconButton>
                <Typography mt={5} mb={2} variant="h6">
                  {item.answers[3].answer}{" "}
                </Typography>
                <Typography>username: {item.answers[1].answer} </Typography>
                <Typography>password: {item.answers[2].answer} </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </>
  );
};

export default Forms;
