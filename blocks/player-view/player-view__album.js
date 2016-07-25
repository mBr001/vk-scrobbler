(function() {
  'use strict';

  let qsa = document.querySelectorAll.bind(document);
  let log = window.vkScrobbler.log;
  const DEFAULT_COVER = chrome.extension.getURL("blocks/indicators/__img/player-view__default-cover.png");

  let album = {
    // returning all selectors with particular classname in array
    getSelectorsArray: (className) => [].slice.call(qsa(className)),

    setAlbumCover: function(imgUrl) {
      let playButtonArray = this.getSelectorsArray(".audio_page_player_play");
      let bgImg = "url('" + DEFAULT_COVER + "')";
      if (imgUrl) {
        console.log(bgImg);
        bgImg = "url('" + imgUrl + "')";
      }
      playButtonArray.map((div) => div.style.backgroundImage = bgImg);
    },

    setAlbumTitle: function(title) {
      document.getElementById("albumTitle").innerHTML = title;
    },

    modifyPlayer: function() {
      // modifying VK player in dropdown and audio page

      // remove prev and next
      this.removeButtons(".audio_page_player_prev, .audio_page_player_next");

      // add styles to play/pause buttons
      this.modifyPlayButton();

      // setting default cover
      this.setAlbumCover(DEFAULT_COVER);

      // inserting <span> to hold album titles
      let wrapperAr = this.getSelectorsArray(".audio_page_player_track_wrap");
      let span = document.createElement('span');
      span.setAttribute("id", "albumTitle");
      wrapperAr.map((div) => div.appendChild(span));

    },

    modifyPlayButton: function() {
      let playButtonArray = this.getSelectorsArray(".audio_page_player_play");
      playButtonArray.map((div) => div.firstElementChild.classList.add("playIcon"));
    },

    removeButtons: function(classNames) {
      let buttons = this.getSelectorsArray(classNames);
      buttons.map((div) => div.remove());
    },
  };
  window.vkScrobbler.album = album;

})();
