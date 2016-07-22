(function() {
  'use strict';

  let qsa = document.querySelectorAll.bind(document);
  const DEFAULT_COVER =  chrome.extension.getURL("blocks/indicators/__icon/indicators__defaultCover.png");

  let album = {
    getPlayButtonArray: (className) => qsa(className),

    setAlbumCover: function(imgUrl) {
      let playButtonArray = this.getPlayButtonArray(".audio_page_player_play");
      let bgImg = "url('" + DEFAULT_COVER + "')";
      if (imgUrl) {
        console.log(bgImg);
        bgImg = "url('" + imgUrl + "')";
      }
      [].slice.call(playButtonArray).map((div) => div.style.backgroundImage = bgImg);
    },

    modifyPlayer: function() {
      let playButtonArray = this.getPlayButtonArray(".audio_page_player_play");

      [].slice.call(playButtonArray).map((div) => div.firstElementChild.classList.add("playIcon"));
    },
  };
  window.vkScrobbler.album = album;

})();
