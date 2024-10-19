chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startCapture') {
    chrome.tabCapture.capture({ video: true, audio: false }, (stream) => {
      if (stream) {
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          chrome.runtime.sendMessage({ action: 'captureComplete', videoUrl: url });
        };

        recorder.start();

        chrome.runtime.onMessage.addListener((innerRequest) => {
          if (innerRequest.action === 'stopCapture') {
            recorder.stop();
            stream.getTracks().forEach(track => track.stop());
          }
        });
      }
    });
  }
  return true;
});