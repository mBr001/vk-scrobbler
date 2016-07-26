(function() {
  'use strict';

  var playerHandlers = new window.vkScrobbler.PlayerHandlers();
  var scriptInjector = window.vkScrobbler.scriptInjector;
  let playerView = window.vkScrobbler.playerView;
  let IndicatorsOld = window.vkScrobbler.IndicatorsOld;
  var isOldUI = Boolean(document.getElementById('top_new_msg')); //new UI doesn't have this element
  var log = window.vkScrobbler.log;

  log.i('content.js: New ui detected = ' + !isOldUI);

  function instantIndicatorsInserter() {
    //observe players inserting in document to instantly insert indicators nodes
    var playersObserver = new MutationObserver(function(mutations) {
        mutations.map(function(mutation) {
          // console.log("class: "+mutation.target.className);
          if (mutation.target.classList && mutation.target.classList.contains('top_audio_layer')){
            playerView.modifyDropdown();
            playerView.modifyAudioPage();
            return;
          }
        });
      }),
      options = {
        'childList': true,
        'subtree': true
      };
    playersObserver.observe(document.body, options);

    //If audio page is a landing page, then just attaching indicators etc
    playerView.modifyAudioPage();
    playerView.modifyHeader();

    window.addEventListener('load', function() {
      playerView.modifyAudioPage();
      playerView.modifyHeader();
    });
  }

  function instantIndicatorsInserterOld() {
    //observe players inserting in document to instantly insert indicators nodes

    // http://frontender.info/mutation-observers-tutorial

    var playersObserver = new MutationObserver(function(mutations) {
        mutations.map(function(mutation) {
          // console.log("id:"+mutation.target.id);
          if (mutation.target.id === 'pad_cont') {
            IndicatorsOld.SetAllPD();
            log.i("Indicators inserted in the old music pad.");
          }
          if (mutation.target.id === 'gp') {
            IndicatorsOld.SetAllMini();
            log.i("Indicators inserted in the old music left minipad.");
          }
          if (mutation.target.id === 'wrap3' && mutation.target.querySelector('#audio') !== null) {
            IndicatorsOld.SetAllAC();
            log.i("Indicators inserted in the old music page topbar.");
          }
        });
      }),
      options = {
        'childList': true,
        'subtree': true
      };
    playersObserver.observe(document.body, options);

    //If audio page is a landing page, then just attaching indicators
    IndicatorsOld.SetAllAC();
    window.addEventListener("load", function() {
      IndicatorsOld.SetAllAC();
    });
  }

  var activate = function() {
    if (isOldUI) {
      instantIndicatorsInserterOld();
    } else {
      instantIndicatorsInserter();
    }

    scriptInjector.injectPatcher();

    window.addEventListener('message', function(e) {
      if (e.data.vkPlayerPatcherMessage) {
        var payload = e.data.message;

        playerHandlers[payload.message](payload.data);
      }
    }, false);
  };
  activate();
})();
