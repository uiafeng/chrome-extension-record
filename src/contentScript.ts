chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getVideoElement') {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      sendResponse({ found: true });
    } else {
      sendResponse({ found: false });
    }
  }
  return true;
});