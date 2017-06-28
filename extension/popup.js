/*
popup.js
Contains logic for displaying to do list, adding and deleting items

functions roughly based off of those at http://code-maven.com/todo-in-html-and-javascript

Computer Science 50
Final Project: Select Yo Tasks

Marcella Park
marcellapark@college.harvard.edu
*/

// when icon clicked and popup opened, execute content script to get text selection
document.onload = chrome.tabs.executeScript(null, {file: "contentscript.js"});

// listen for message from content script
chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    // if text was selected
    if (message.tag == "selection")
    {
      // add selected text to to do list, then show to do list!
      var text = message.selection;
      var link = message.url;
      addyotask(text, link);
      // send that response
      sendResponse("got that selection: " + text + "\n got that url: " + link);
    }
    // if no text was selected
    else if (message == "no selection")
    {
      // just show that to do list!
      addnotask();
      // send that response
      sendResponse("ok no selection");
    }
});

/*
adds given item to the top of the to do list; displays that to do list
*/
function addyotask(text, link)
{
  // store text and link in an object
  var task = {text: text, link: link};
  // first, get array of tasks already in storage
  getyotasks(function(tasks) {
    // only after getting that array, execute the following on it:

    // add new task to the beginning of tasks array
    tasks.unshift(task);
    // update tasks array in storage to reflect that change
    chrome.storage.sync.set({'tasks': tasks});
    // display tasks
    seeyotasks(tasks);
  });
}

/*
displays current to do list without adding any items
*/
function addnotask()
{
  // first, get array of tasks already in storage
  getyotasks(function(tasks) {
    // only after getting that array, execute the following on it:

    // display tasks
    seeyotasks(tasks);
  });
}

/*
gets user's tasks from chrome.storage
*/
function getyotasks(callback)
{
  // start with empty array for tasks
  var heresyotasks = new Array;
  // replace empty array with array from storage if there is one already in there
  chrome.storage.sync.get('tasks', function(result){
    if (result['tasks'] != null)
    {
      heresyotasks = result['tasks'];
    }

    // execute whatever's next on tasks gotten
    callback(heresyotasks);
  });
}

/*
puts given tasks array in popup window html
*/
function seeyotasks(theresyotasks)
{
  // generate html for each task in tasks
  var html = '<ul>';
  for (var i = 0; i < theresyotasks.length; i++)
  {
      html += '<li>'
      + '<input type="checkbox" class="checkbox" id="' + i + '">'
      // put url of page that text was selected from into hyperlink
      + '<a href="' + theresyotasks[i].link + '" target="_blank">'
      // put in user selection as hyperlink text
      + theresyotasks[i].text + '</a>';
      + '</li>';
  }
  html += '</ul>';

  // insert html into popup window
  document.getElementById("todo").innerHTML = html;

  // add event listener to each checkbox to remove corresponding task when checked
  var items = document.getElementsByClassName("checkbox");
  for (var i = 0; i < items.length; i++)
  {
    item = items[i];
    item.addEventListener("change", removeyotask);
  }
}

/*
does something when you check off a task
*/
function removeyotask()
{
  var id = this.getAttribute('id');

  // first, get array of tasks already in storage
  getyotasks(function(tasks) {
    // only after getting that array, execute the following on it:

    // add new task to the beginning of tasks array
    tasks.splice(id, 1);
    // update tasks array in storage to reflect that change
    chrome.storage.sync.set({'tasks': tasks});
    // display tasks
    seeyotasks(tasks);
  });

  return false;
}
