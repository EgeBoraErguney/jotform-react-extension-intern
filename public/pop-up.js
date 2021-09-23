/*global chrome*/
window.onload = function () {
  var username = document.getElementById("popup_username_text");
  var password = document.getElementById("popup_password_text");
  var button = document.getElementById("popup_save_button");
  if (button) {
    button.addEventListener("click", () => getInputData(username, password));
  }
};



function handleClick(username, password,response) {
  if (response && username && password) {
    username.innerHTML = response.data.username;
    password.innerHTML = response.data.password;
  }
}

async function getInputData(username,password) {
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
          { action: "getFormData" },
          (response) => handleClick(username,password,response)
        );
      }
    });
}
