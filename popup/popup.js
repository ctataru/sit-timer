'use strict';

const intervalInput = document.getElementById('interval_input');
const goButton = document.getElementById('go_button');
const intervalData = {
  active: false,
  done: false,
  interval: 5
};

function updateCache() {
  chrome.storage.sync.set({ intervalData });
}

function main() {
  const { active, done, interval } = intervalData;
  intervalInput.value = interval;

  if (done && !active) {
    goButton.innerHTML = 'I\'m back!';
  } else if (active) {
    goButton.innerHTML = 'Stop';
  } else {
    goButton.innerHTML = 'Go';
  }
}

chrome.storage.sync.get('intervalData', (data) => {
  Object.assign(intervalData, data.intervalData);
  main();
})

intervalInput.addEventListener('change', (event) => {
  intervalData.interval = event.target.value;
  updateCache();
});

goButton.addEventListener('click', () => {
  if (intervalData.active) {
    intervalData.active = false;
    goButton.innerHTML = 'Go';
  } else {
    intervalData.active = true;
    goButton.innerHTML = 'Stop';
    chrome.runtime.sendMessage({ message: 'launch_interval' });
  }
  updateCache();
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === 'interval_finished') {
    goButton.innerHTML = 'I\'m back!';
  }
});
