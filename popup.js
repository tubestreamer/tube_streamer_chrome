// URL Base64 wihtout padding
function base64url(str) {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function qs(query, variable) {
    var vars = query.substring(1).split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    if (url.includes("youtube") && url.includes("watch")) {
      renderStatus('Performing Tube Streamer');
      var p = document.createElement('a');
      p.href = url;
      normalized_url = p.protocol + "//" + p.host + p.pathname + "?" + "v=" + qs(p.search, "v");
      var streamUrl = 'http://tubestreamer.ru/stream/' + base64url(normalized_url);
      chrome.tabs.create({ url: streamUrl });
    } else{
      renderStatus('It is not YouTube.');
    }
  });
});
