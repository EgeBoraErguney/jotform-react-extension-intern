/*global chrome*/
window.addEventListener("load", () => handleLoad(), false);

function handleLoad() {
  var username = document.getElementById("popup_username_text");
  var password = document.getElementById("popup_password_text");
  var button = document.getElementById("popup_save_button");
  var closeButton = document.getElementById("popup_close_button");
  var togglePasswordButton = document.getElementById(
    "popup_toggle_password_button"
  );
  if (username && password && button) {
    getInputData(username, password, button);
  }
  if (closeButton) {
    closeButton.addEventListener("click", () => CloseButton());
  }
  if (togglePasswordButton) {
    togglePasswordButton.addEventListener("click", () =>
      TogglePasswordButton()
    );
  }
}

function TogglePasswordButton() {
  var password = document.getElementById("popup_password_text");
  if (password) {
    if (password.type === "text") {
      password.type = "password";
    }else{
      password.type = "text";
    }
  }
}

function handleClick(username, password, button, url, response) {
  if (response && username && password && button) {
    username.innerHTML = response.data.username;
    password.value = response.data.password;
    if (button) {
      button.addEventListener("click", () =>
        post(
          response.data.username,
          response.data.password,
          url,
          response.data.formId,
          response.data.apiKey
        )
      );
    }
  }
}

function CloseButton() {
  chrome.tabs &&
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (
        typeof tabs !== "undefined" &&
        tabs &&
        typeof tabs[0] !== "undefined" &&
        tabs[0]
      ) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "closePopUp" },
          function (response) {}
        );
      }
    });
}

function post(username, password, url, formId, apiKey) {
  var data = new FormData();
  data.append("submission[1]", username);
  data.append("submission[2]", password);
  data.append("submission[3]", url);

  var xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://api.jotform.com/form/" + formId + "/submissions?apiKey=" + apiKey,
    true
  );
  xhr.send(data);
  CloseButton();
}

function getInputData(username, password, button) {
  chrome.tabs &&
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (
        typeof tabs !== "undefined" &&
        tabs &&
        typeof tabs[0] !== "undefined" &&
        tabs[0]
      ) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "getFormDataFromPopUp" },
          function (response) {
            handleClick(username, password, button, tabs[0].url, response);
          }
        );
      }
    });
}
