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
      fillFormData(request.username, request.password);
      sendResponse({ data: "success" });
    }
  }
});


document.addEventListener ("DOMContentLoaded", openPopUp(), false);

function openPopUp() {
  const elem = document.createElement("div");
  elem.id = "popupdiv_jotform-extension";
  elem.innerHTML = `<iframe id="iframe_jotform_extension"></iframe>`;
  elem.style.cssText = "z-index:16777271; position:fixed; float:right; margin-right: 30px; margin-top: 30px";
  document.documentElement.appendChild(elem);

  const iframe = document.getElementById("iframe_jotform_extension");
  iframe.style.cssText ="z-index:16777271; position:fixed; right:30px; width:200px; height:200px ";
  iframe.src = chrome.extension.getURL("pop-up.html");
  chrome.runtime.sendMessage({ action: "executePopUpJs" }, function (response) {
    console.log(response);
  });
}
