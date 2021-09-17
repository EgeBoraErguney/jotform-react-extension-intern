import React, { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";

const Forms = () => {
  const apiKey = localStorage.getItem("apiKey");
  const [formId, setFormId] = useState("");

  useEffect(() => {
    const getFormData = {
      method: "get",
      url: "https://api.jotform.com/user/forms?apiKey=" + apiKey,
    };
    axios(getFormData)
      .then((resp) => {
        if (
          resp.data.content.filter(
            (obj) => obj.title == "Jotform_Password_Manager"
          ).length < 1
        ) {
          PostFunction();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
        console.log(resp);
        console.log(resp.data.content.id);
        setFormId((prevState) => {
          return resp.data.content.id;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <h1>Welcome</h1>
      {apiKey}
    </>
  );
};

export default Forms;
