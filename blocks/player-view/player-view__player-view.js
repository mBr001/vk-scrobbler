(function() {
  'use strict';
  let Indicators = window.vkScrobbler.Indicators;
  let IndicatorsOld = window.vkScrobbler.IndicatorsOld;
  let album = window.vkScrobbler.album;
  let Utils = window.vkScrobbler.playerViewUtils;
  let log = window.vkScrobbler.log;

  let playerView = {
    modifyPlayButton: function() {
      let playButtonArray = Utils.getSelectorsArray(".audio_page_player_play");
      playButtonArray.map((div) => div.firstElementChild.classList.add("playIcon"));
    },

    removeButtons: function(classNames) {
      let buttons = Utils.getSelectorsArray(classNames);
      buttons.map((div) => div.remove());
    },
    modifyDropdown: function() {
      Indicators.SetDropdownIndicators();
      album.createAlbumTitleHolder();
      album.setAlbumCover();
      this.modifyPlayButton();
      // remove prev and next
      this.removeButtons(".audio_page_player_prev, .audio_page_player_next");
      log.i("Modifying DROPDOWN");
    },
    modifyAudioPage: function() {
      this.modifyPlayButton();
      // remove prev and next
      this.removeButtons(".audio_page_player_prev, .audio_page_player_next");
      Indicators.SetAudioPageIndicators();
      album.createAlbumTitleHolder();
      album.setAlbumCover();
      log.i("Modifying AUDIOPAGE");

    },
    modifyHeader: function() {
      Indicators.SetHeaderIndicator();
      log.i("Modifying HEADER");
    }
  };

  window.vkScrobbler.playerView = playerView;

})();
