var mou_webplayer_interval = setInterval(function () {
    if (typeof player !== "undefined") {
      player.fullscreen.enter();
      clearInterval(mou_webplayer_interval);
    }
  }, 10);
  setTimeout(() => {
    clearInterval(mou_webplayer_interval);
  }, 30 * 1000);
  // player.on('ready', (event) => {
  //   const instance = event.detail.plyr;
  //   instance.fullscreen.enter();
  
  // });