function getFormData() {
  var inputs = document.getElementsByTagName("input");
  var username = "";
  var password = "";
  var i = 0;
  for (; i < inputs.length; i++) {
    if (
      inputs[i].type.toLowerCase() == "password" ||
      inputs[i].name.toLowerCase() == "password"
    ) {
      password = inputs[i].value;
      break;
    }
  }
  for (; i >= 0; i--) {
    if (
      inputs[i].type.toLowerCase() == "email" ||
      inputs[i].type.toLowerCase() == "username" ||
      inputs[i].type.toLowerCase() == "name" ||
      inputs[i].type.toLowerCase() == "user" ||
      inputs[i].name.toLowerCase() == "email" ||
      inputs[i].name.toLowerCase() == "username" ||
      inputs[i].name.toLowerCase() == "name" ||
      inputs[i].name.toLowerCase() == "user"
    ) {
      username = inputs[i].value;
      break;
    }
  }

  return {
    username: username,
    password: password,
  };
}

function fillFormData(username, password) {
  var inputs = document.getElementsByTagName("input");
  var i = 0;
  for (; i < inputs.length; i++) {
    if (
      inputs[i].type.toLowerCase() == "password" ||
      inputs[i].name.toLowerCase() == "password"
    ) {
      inputs[i].value = password;
      break;
    }
  }
  for (; i >= 0; i--) {
    if (
      inputs[i].type.toLowerCase() == "email" ||
      inputs[i].type.toLowerCase() == "username" ||
      inputs[i].type.toLowerCase() == "name" ||
      inputs[i].type.toLowerCase() == "user" ||
      inputs[i].name.toLowerCase() == "email" ||
      inputs[i].name.toLowerCase() == "username" ||
      inputs[i].name.toLowerCase() == "name" ||
      inputs[i].name.toLowerCase() == "user"
    ) {
      inputs[i].value = username;
      break;
    }
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    if (request.action === "getFormData") {
      const dataFromFunction = getFormData();
      sendResponse({ data: dataFromFunction });
    }
    if (request.action === "fillFormData") {
      fillFormData(request.username,request.password);
      sendResponse({ data: "success" });
    }
  }
});