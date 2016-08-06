(function() {
  // Restoring options when page loads
  document.addEventListener("DOMContentLoaded", function() {
    console.log(document.getElementById("twitter").checked);

    storageGet({
      twitter: true,
      eq: {
        showTopbar: true,
        animation: true
      }
    }, (res) => {
      document.getElementById("twitter").checked = res.twitter;
      document.getElementById("eqShowTopbar").checked = res.eq.showTopbar;
    });
  });

  // Saving options
  document.getElementById("save").addEventListener("click", function(e) {
    console.log(document.getElementById("twitter").checked);
    chrome.storage.local.set({
      twitter: document.getElementById("twitter").checked,
      eq: {
        showTopbar: document.getElementById("eqShowTopbar").checked,
      }
    });
    this.classList.add("btn--done");
    this.innerHTML = "✔️";
  });
  document.getElementById("optionsRows").addEventListener("click", function(e) {
    document.getElementById("save").classList.remove("btn--done");
    document.getElementById("save").innerHTML = "Save";
  });

  // Because Firefox doesn't support syncing between
  // Chrome browsers
  let storageGet = function (defaults, getThings) {
    if (chrome.storage.sync) {
      chrome.storage.sync.get(defaults, getThings);
    } else {
      chrome.storage.local.get(defaults, getThings);
    }
  };
})();
