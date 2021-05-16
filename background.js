'use strict';

const MINUTES = 1000 * 60;

function handleMessage(request) {
  if (request.message === 'launch_interval') {
    launchInterval();
  }
}

function sendNotification() {
  chrome.notifications.create('', {
    title: 'SitTimer',
    message: 'Get on up! Return to the extension to restart the interval.',
    iconUrl: '/images/icon.png',
    type: 'basic'
  });
}

function launchInterval() {
  chrome.storage.sync.get('intervalData', (data) => {
    const { intervalData } = data;
    setTimeout(() => {
      chrome.storage.sync.set({
        intervalData: {
          ...intervalData,
          active: false,
          done: true
        }
      });
      sendNotification();
    }, intervalData.interval * MINUTES)
  });
}


chrome.runtime.onMessage.addListener(handleMessage);
