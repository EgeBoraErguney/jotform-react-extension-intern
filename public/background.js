chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    if (request.action === "executePopUpJs") {
      chrome.tabs.executeScript({
        file: "pop-up.js",
      });
      localStorage.setItem("openPopUp", true);
      if (request.data && request.data.username != "")
        localStorage.setItem("username", request.data.username);
      if (request.data && request.data.password != "")
        localStorage.setItem("password", request.data.password);
      sendResponse("done");
    }
    if (request.action === "getLocalStorage") {
      sendResponse({ data: localStorage[request.key] });
    }
    if (request.action === "getFormDataFromContentScript") {
      const res = {
        data: {
          username: localStorage["username"],
          password: localStorage["password"],
          formId: localStorage["formId"],
          apiKey: localStorage["apiKey"],
        },
      };
      sendResponse(res);
    }
    if (request.action === "setOpenPopUpFalse") {
      localStorage.setItem("openPopUp", false);
    }
  }
});