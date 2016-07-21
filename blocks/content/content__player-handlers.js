(function() {
  'use strict';
  var isOldUI = Boolean(document.getElementById('top_new_msg')); //new UI doesn't have this element

  const SCROBBLE_PERCENTAGE = 50;
  var nowPlayingInterval = 15 * 1000;

  var log = window.vkScrobbler.log;

  var utils = window.vkScrobbler.ContentUils;
  var Indicators = isOldUI ? window.vkScrobbler.IndicatorsOld : window.vkScrobbler.Indicators;
  var BusWrapper = window.vkScrobbler.ContentBusWrapper;

  function PlayerHandlers() {
    this.busWrapper = new BusWrapper();
    this.state = {
      enabled: true,
      playing: false,
      scrobbled: false,
      scrobbling: false,

      firstPlay: true,

      artist: null,
      track: null,

      nowPlayingSendTimeStamp: null,
      playTimeStamp: null, //timeStamp of previous "progress" call
      playedTime: 0
    };

    this.setUpIndicatorsListeners();
  }

  PlayerHandlers.prototype.progress = function(data) {
    if (!this.state.playing) {
      return;
    }
    var timeDiff = Date.now() - (this.state.playTimeStamp || Date.now());
    this.state.playedTime += timeDiff / 1000;

    this.state.playTimeStamp = Date.now();
    this.sendNowPlayingIfNeeded();
    var playedPercent = this.state.playedTime / data.total * 100;
    this.scrobbleIfNeeded(playedPercent);
  };

  PlayerHandlers.prototype.pause = function() {
    this.state.playing = false;
    this.state.playTimeStamp = null;
    this.indicateScrobblerStatus();
  };

  PlayerHandlers.prototype.resume = function(data) {
    if (!this.state.artist && !this.state.artist) {
      return this.playStart(data);
    }

    this.state.playing = true;
    this.indicateScrobblerStatus();
  };

  PlayerHandlers.prototype.stop = function() {
    this.state.playing = false;
    this.state.enabled && Indicators.indicateVKscrobbler();
  };

  PlayerHandlers.prototype.playStart = function(data) {
    this.state.artist = data.artist;
    this.state.track = data.title;

    this.state.scrobbled = false;
    this.state.playing = true;
    this.state.playedTime = 0;
    this.state.playTimeStamp = Date.now();
    this.state.nowPlayingSendTimeStamp = null;

    this.state.enabled && Indicators.indicatePlayNow();
    Indicators.setTwitButtonHref(utils.getTwitLink(data.artist, data.title));

    this.busWrapper.getTrackInfoRequest(data.artist, data.title)
      .then(function(response) {
        this.checkTrackLove(response, data.artist, data.title);
        this.showAlbumCover(response);
      }.bind(this));
  };

  PlayerHandlers.prototype.isNowPlayingIntervalPassed = function() {
    return Date.now() - this.state.nowPlayingSendTimeStamp > nowPlayingInterval;
  };

  PlayerHandlers.prototype.sendNowPlayingIfNeeded = function() {
    if (this.state.enabled && (!this.state.nowPlayingSendTimeStamp || this.isNowPlayingIntervalPassed())) {
      this.busWrapper.sendNowPlayingRequest(this.state.artist, this.state.track);
      this.state.nowPlayingSendTimeStamp = Date.now();
    }
  };

  PlayerHandlers.prototype.scrobbleIfNeeded = function(percent) {
    if (this.state.enabled &&
      !this.state.scrobbled &&
      !this.state.scrobbling &&
      this.state.artist &&
      this.state.track &&
      percent > SCROBBLE_PERCENTAGE) {
      this.state.scrobbling = true;
      this.busWrapper.sendScrobleRequest(this.state.artist, this.state.track)
        .then(function() {
          this.state.scrobbling = false;
          this.state.scrobbled = true;
          Indicators.indicateScrobbled();
        }.bind(this), function onError() {
          this.state.scrobbling = false;
        }.bind(this));
    }
  };

  PlayerHandlers.prototype.isSameTrack = function(artist, track) {
    return this.state.artist === artist && this.state.track === track;
  };

  PlayerHandlers.prototype.checkTrackLove = function(response, artist, track) {
    Indicators.indicateNotLove();

    var loved = response.track && response.track.userloved === '1';
    log.i("Is this track loved: "+loved);
    if (loved && this.isSameTrack(artist, track)) {
      log.i("Indicate loved");
      Indicators.indicateLoved();
    }
  };

  PlayerHandlers.prototype.indicateScrobblerStatus = function() {
    if (!this.state.enabled) {
      Indicators.indicatePauseScrobbling();
    } else if (this.state.scrobbled) {
      Indicators.indicateScrobbled();
    } else if (this.state.playing) {
      Indicators.indicatePlayNow();
    } else {
      Indicators.indicateVKscrobbler();
    }
  };

  PlayerHandlers.prototype.setUpIndicatorsListeners = function() {
    Indicators.setListeners({
      toggleLove: function(isLove) {
        if (!this.state.artist || !this.state.track) {
          return new Promise(function(resolve, reject) {
            reject();
          });
        }
        if (isLove) {
          return this.busWrapper.sendUnlove(this.state.artist, this.state.track).then(Indicators.indicateNotLove);
        } else {
          return this.busWrapper.sendNeedLove(this.state.artist, this.state.track).then(Indicators.indicateLoved);
        }
      }.bind(this),
      togglePauseScrobbling: function togglePauseScrobbling() {
        this.state.enabled = !this.state.enabled;
        this.indicateScrobblerStatus();
        this.busWrapper.sendPauseStatus(this.state.artist, this.state.track, !this.state.enabled);
      }.bind(this)
    });
  };

  PlayerHandlers.prototype.showAlbumCover = function(response) {
    if (response.track.album) {
      Indicators.setAlbumCover(response.track.album.image[1]["#text"]);
      console.log("Set album cover: ", response.track.album.image[1]["#text"]);
    }
  };

  window.vkScrobbler.PlayerHandlers = PlayerHandlers;
})();
