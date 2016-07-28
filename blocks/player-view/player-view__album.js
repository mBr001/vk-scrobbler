(function() {
  'use strict';

  let log = window.vkScrobbler.log;
  let Utils = window.vkScrobbler.playerViewUtils;
  const PATHS = Utils.PATHS;

  let album = {
    setAlbumCover: function(imgUrl = PATHS.DEFAULT_COVER) {
      // Getting array of all play buttons and changing their background image
      // @TODO REFACTOR THIS!!!
      let playButtonArray = Utils.getSelectorsArray(".audio_page_player_play");
      let bgImg = "url('" + PATHS.DEFAULT_COVER + "')";
      if (imgUrl !== undefined) {
        console.log(bgImg);
        bgImg = "url('" + imgUrl + "')";
      }
      playButtonArray.map((div) => div.style.backgroundImage = bgImg);
    },

    createAlbumTitleHolder: function () {
      // inserting <span> to hold album titles
      let wrapperAr = Utils.getSelectorsArray(".audio_page_player_track_wrap");
      let span = document.createElement('span');
      span.setAttribute("id", "albumTitle");
      wrapperAr.map((div) => div.appendChild(span));
      log.i("createAlbumTitleHolder");
    },

    setAlbumTitle: function(title) {
      document.getElementById("albumTitle").innerHTML = title;
    }
  };
  window.vkScrobbler.album = album;

})();
