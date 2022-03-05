chrome.runtime.onMessage.addListener((message, sender, callback) => {
    console.log(arguments);
});