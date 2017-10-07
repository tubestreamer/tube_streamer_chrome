function b32encode(s) {
    /* encodes a string s to base32 and returns the encoded string */
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

    var parts = [];
    var quanta= Math.floor((s.length / 5));
    var leftover = s.length % 5;

    if (leftover != 0) {
       for (var i = 0; i < (5-leftover); i++) { s += '\x00'; }
       quanta += 1;
    }

    for (i = 0; i < quanta; i++) {
       parts.push(alphabet.charAt(s.charCodeAt(i*5) >> 3));
       parts.push(alphabet.charAt( ((s.charCodeAt(i*5) & 0x07) << 2)
           | (s.charCodeAt(i*5+1) >> 6)));
       parts.push(alphabet.charAt( ((s.charCodeAt(i*5+1) & 0x3F) >> 1) ));
       parts.push(alphabet.charAt( ((s.charCodeAt(i*5+1) & 0x01) << 4)
           | (s.charCodeAt(i*5+2) >> 4)));
       parts.push(alphabet.charAt( ((s.charCodeAt(i*5+2) & 0x0F) << 1)
           | (s.charCodeAt(i*5+3) >> 7)));
       parts.push(alphabet.charAt( ((s.charCodeAt(i*5+3) & 0x7F) >> 2)));
       parts.push(alphabet.charAt( ((s.charCodeAt(i*5+3) & 0x03) << 3)
           | (s.charCodeAt(i*5+4) >> 5)));
       parts.push(alphabet.charAt( ((s.charCodeAt(i*5+4) & 0x1F) )));
    }

    var replace = 0;
    if (leftover == 1) replace = 6;
    else if (leftover == 2) replace = 4;
    else if (leftover == 3) replace = 3;
    else if (leftover == 4) replace = 1;

    for (i = 0; i < replace; i++) parts.pop();
    for (i = 0; i < replace; i++) parts.push("=");

    return parts.join("");
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

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    if (url.includes("youtube") && url.includes("watch")) {
      renderStatus('Performing Tube Streamer');
      var streamUrl = 'http://tubestreamer.ru/stream/' + b32encode(url);
      chrome.tabs.create({ url: streamUrl });
    } else{
      renderStatus('It is not YouTube.');
    }
  });
});
