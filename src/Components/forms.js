import React, { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";

const Forms = () => {
  const apiKey = localStorage.getItem("apiKey");
  const [formId, setFormId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
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
          setFormId(resp.data.content.filter(
            (obj) => obj.title === "Jotform_Password_Manager"
          )[0].id);
        }
      })
      .catch((error) => {
        console.log(error);
      });  
  }, []);
/*
  function PutEncryptedProperty(formId) {
    const putFormData = {
      method: "put",
      url:
        "https://api.jotform.com/form/" +
        formId +
        "/properties?apiKey=" +
        apiKey,
      data: {
        properties: {
          isEncrypted: "Yes",
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
*/
  function PostFunction() {
    const postFormData = {
      method: "post",
      url: "https://api.jotform.com/user/forms?apiKey=" + apiKey,
      data: qs.stringify({
        "questions[1][type]": "control_textbox",
        "questions[1][text]": "usrnm",
        "questions[1][order]": 0,
        "questions[1][name]": "usrnm",
        "questions[2][type]": "control_textbox",
        "questions[2][text]": "psswrd",
        "questions[2][order]": 1,
        "questions[2][name]": "psswrd",
        "questions[3][type]": "control_textbox",
        "questions[3][text]": "url",
        "questions[3][order]": 2,
        "questions[3][name]": "url",
        "properties[title]": "Jotform_Password_Manager",
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    };
    axios(postFormData)
      .then((resp) => {
        setFormId(resp.data.content.id);
        //PutEncryptedProperty(resp.data.content.id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName && password && url) {
      const account = {userName, password, url};
      console.log(account); 
      const addSubmission = {
        method: "post",
        url: "https://api.jotform.com/form/" + formId + "/submissions?apiKey=" + apiKey,
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
      });
      setUserName("");
      setPassword("");
      setUrl("");
    } else {
      console.log('empty values');
    }
  }

  return (
    <>
      <h1>Please fill this form to store your password in secure way</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='userName'>username : </label>
          <input
            type='text'
            id='userName'
            name='userName'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='password'>password : </label>
          <input
            type='password'
            id='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='url'>url : </label>
          <input
            type='text'
            id='url'
            name='url'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
          <button type='submit'>add </button>
      </form>
    </>
  );
};

export default Forms;
