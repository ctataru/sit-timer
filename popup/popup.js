'use strict';

// add event listener to get input value for intervals

// add even listener to get on click for "start" and "i'm back!"

// re-open popup when timer is finished and display "i'm back!" button (should this be in background.js?)


// set interval in storage when user clicks on "go"
// retrieve interval and set as value element.innerHtml()


// button text:
// - when timer running, "stop" -> pause timer, keep value in storage
// - when nothing running, "go" -> start timer, close pop-up after short delay
// - when timer hits 0, "i'm back" -> start timer, close pop-up after short delay


const intervalInput = document.getElementById('interval_input');
const goButton = document.getElementById('go_button');
const intervalData = { active: false, interval: 5, intervalSet: false };

function updateCache() {
  chrome.storage.sync.set({ intervalData });
}

function main() {
  const { interval } = intervalData;
  intervalInput.value = interval;

  if (intervalData.active) {
    goButton.innerHTML = 'Stop';
  } else {
    goButton.innerHTML = 'Go';
  }
}

function launchTimeout() {
  intervalData.active = false;
  intervalData.intervalSet = false;
  goButton.innerHTML = 'I\'m back!';
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
  const { active, interval, intervalSet } = intervalData;

  if (active) {
    intervalData.active = false;
    goButton.innerHTML = 'Go';
  } else {
    intervalData.active = true;
    goButton.innerHTML = 'Stop';
    if (!intervalSet) {
      intervalData.intervalSet = true;
      setTimeout(launchTimeout, interval * 1000);
    }
  }
  updateCache();
});
