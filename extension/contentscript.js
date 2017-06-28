/*
contentscript.js
Gets selected text and url from active tab

Computer Science 50
Final Project: Select Yo Tasks

Marcella Park
marcellapark@college.harvard.edu
*/

// get user-selected text
var selection = window.getSelection().toString();

// make sure it's valid text!
if (selection != "")
{
    // escape things
    selection = escapeHtml(selection);
    // get url text was found at
    var url = window.location.href;
    // for testing purposes
    console.log("selection: " + selection + "\n url: " + url);
    // send that text back to extension
    chrome.runtime.sendMessage({tag: "selection", selection: selection, url: url},
    function(response) {
      // for testing purposes
      console.log(response);
    });
}

else
{
  // for testing purposes
  console.log("no selection!");
  // tell extension no text selected
  chrome.runtime.sendMessage("no selection", function(response) {
    // for testing purposes
    console.log(response);
  });
}

/*
escapes things;
code from
http://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript
*/
function escapeHtml(text) {
  var map = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
