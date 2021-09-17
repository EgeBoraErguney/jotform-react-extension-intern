import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';

const Forms = () => {
    const apiKey = localStorage.getItem("apiKey");;
    const [formId, setFormId] = useState(0);

    useEffect(() => {  
      const postFormData = {
        method: "post",
        url: "https://api.jotform.com/user/forms?apiKey=" + apiKey,
        data: qs.stringify({
          "questions[1][type]": "control_textbox",
          "questions[1][text]": "usrnm",
          "questions[1][order]": 0,
          "questions[1][name]": "usrnm",
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
          setFormId(resp.data.content.id);
        })
        .catch((error) => {
          console.log(error);
        });
/*
      const putFormData = {
        method: "put",
        url: "https://api.jotform.com/form/" + formId + "/questions?apiKey=" + apiKey,
        data: qs.stringify({
          "questions":{"2":{"type":"control_textbox","text":"psswrd","order":"2","name":"psswrd"},"3":{"type":"control_textbox","text":"url","order":"3","name":"url"}}
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      };
      axios(putFormData)
        .then((resp) => {
          console.log(resp)
        })
        .catch((error) => {
          console.log(error);
        });
*/
    },[]);

    return (
        <>
            <h1>Welcome</h1>
            {apiKey}
        </>
    )
}

export default Forms;


