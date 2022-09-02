const { ipcRenderer } = require('electron');

let touchCount = 0;
let touchInterval = 0;

onload = () => {
  // check site
  let element = document.getElementsByClassName('js-clock');
  let title = document.title;

  if (!element.length) {
    ipcRenderer.sendToHost('site error', { title: title });
  } else {
    ipcRenderer.sendToHost('site ok');
    console.log('element preload', element[0].innerText);
  }

  // touch event
  // document.body.addEventListener(
  //   'touchstart',
  //   function (e) {
  //     let dif = e.timeStamp - touchInterval;
  //     console.log('touch start', dif);
  //     if (dif < 450) {
  //       touchCount++;
  //       if (touchCount >= 100) {
  //         ipcRenderer.sendToHost('touch_error');
  //         touchCount = 0;
  //       }
  //     } else {
  //       ipcRenderer.sendToHost('touch');
  //       touchCount = 0;
  //     }
  //     touchInterval = e.timeStamp;
  //   },
  //   false
  // );

  // document.body.addEventListener(
  //   'touchend',
  //   function (e) {
  //     let dif = e.timeStamp - touchInterval;
  //     console.log('touch stop', dif);
  //   },
  //   false
  // );
};
