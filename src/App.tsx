import React, { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === 'captureComplete') {
        setVideoUrl(request.videoUrl);
        setIsRecording(false);
      }
    });
  }, []);

  const startCapture = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'getVideoElement' }, (response) => {
          if (response && response.found) {
            chrome.runtime.sendMessage({ action: 'startCapture' });
            setIsRecording(true);
          } else {
            alert('No video element found on the page.');
          }
        });
      }
    });
  };

  const stopCapture = () => {
    chrome.runtime.sendMessage({ action: 'stopCapture' });
  };

  return (
    <div className="w-64 p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-bold mb-4">Video Capture</h1>
      {!isRecording ? (
        <button
          onClick={startCapture}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full"
        >
          <Play size={16} className="mr-2" /> Start Capture
        </button>
      ) : (
        <button
          onClick={stopCapture}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full"
        >
          <Square size={16} className="mr-2" /> Stop Capture
        </button>
      )}
      {videoUrl && (
        <div className="mt-4">
          <a
            href={videoUrl}
            download="captured-video.webm"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded block text-center"
          >
            Download Video
          </a>
        </div>
      )}
    </div>
  );
}

export default App;