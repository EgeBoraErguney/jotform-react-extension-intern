
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

