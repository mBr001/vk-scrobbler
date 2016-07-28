(function() {
  'use strict';

  let log = window.vkScrobbler.log;
  let Utils = window.vkScrobbler.playerViewUtils;
  const PATHS = Utils.PATHS;

  let album = {
    setAlbumCover: function(imgUrl = PATHS.DEFAULT_COVER) {
      // Getting array of all play buttons and changing their background image
      let playButtonArray = Utils.getSelectorsArray(".audio_page_player_play");
      let bgImg = "url('" + imgUrl + "')";
      playButtonArray.map((div) => div.style.backgroundImage = bgImg);
    },

    createAlbumTitleHolder: function() {
      // inserting <span> to hold album titles
      // Is it ok to create span object everytime,
      // when running this function ??
      let wrapperAr = Utils.getSelectorsArray(".audio_page_player_track_wrap");
      let span = document.createElement("span");
      span.setAttribute("class", "album__title");
      wrapperAr.map(function(div) {
        if (!div.contains(span)) {
          log.i("Creating <span>");
          div.appendChild(span);
        }
      });
    },

    setAlbumTitle: function(title) {
      let spans = Utils.getSelectorsArray(".album__title");
      spans.map((span)=> span.innerHTML = title);
    }
  };
  window.vkScrobbler.album = album;

})();
