(function() {
  'use strict';

  let qsa = document.querySelectorAll.bind(document);
  let log = window.vkScrobbler.log;
  const DEFAULT_COVER =  chrome.extension.getURL("blocks/indicators/__icon/indicators__defaultCover.png");

  let album = {
    // returning all selectors with particular classname
    getButtonsArray: (className) => qsa(className),

    setAlbumCover: function(imgUrl) {
      let playButtonArray = this.getButtonsArray(".audio_page_player_play");
      let bgImg = "url('" + DEFAULT_COVER + "')";
      if (imgUrl) {
        console.log(bgImg);
        bgImg = "url('" + imgUrl + "')";
      }
      [].slice.call(playButtonArray).map((div) => div.style.backgroundImage = bgImg);
    },

    modifyPlayer: function() {
      // modifying VK player in dropdown and audio page
      let playButtonArray = this.getButtonsArray(".audio_page_player_play");

      [].slice.call(playButtonArray).map((div) => div.firstElementChild.classList.add("playIcon"));
      
      // remove prev and next
      this.removeButtons(".audio_page_player_prev, .audio_page_player_next");
    },

    removeButtons: function (classNames) {
      let buttons = [].slice.call(this.getButtonsArray(classNames));
      buttons.map((div) => div.remove());
    },
  };
  window.vkScrobbler.album = album;

})();
