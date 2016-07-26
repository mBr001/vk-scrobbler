(function () {
  'use strict';

  let qsa = document.querySelectorAll.bind(document);


  var EIndicateState = {
    logotype: 'logotype',
    nowplaying: 'nowplaying',
    scrobbled: 'scrobbled',
    paused: 'paused'
  };

  const PATHS = {
    PLAYING: chrome.extension.getURL('blocks/player-view/__img/player-view__img-equalizer.gif'),
    DISABLED: chrome.extension.getURL('blocks/player-view/__img/player-view__img-disabled.png'),
    PAUSE: chrome.extension.getURL('blocks/player-view/__img/player-view__img-pause.png'),
    SCROBBLED: chrome.extension.getURL('blocks/player-view/__img/player-view__img-check-blue.png'),
    TWITTER: chrome.extension.getURL("blocks/player-view/__img/player-view__img-tweet.png"),
    HEART_GRAY: chrome.extension.getURL("blocks/player-view/__img/player-view__img-unlove.png"),
    HEART_BLUE: chrome.extension.getURL("blocks/player-view/__img/player-view__img-love.png"),
    DEFAULT_COVER: chrome.extension.getURL("blocks/player-view/__img/player-view__img-default-cover.png")
  };

  /**
   * Interface
   */
  window.vkScrobbler.playerViewUtils = {
    EIndicateState: EIndicateState,
    PATHS: PATHS,
    // returning all selectors with particular classname in array
    getSelectorsArray: (className) => [].slice.call(qsa(className)),
  };
})();
