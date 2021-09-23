chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    if (request.action === "executePopUpJs") {
      chrome.tabs.executeScript({
        file: 'pop-up.js'
      }); 
      sendResponse("done");
    }
  }
});