function handleFailureMessage(msg) {
  alert(msg);
}

var moodmusicobj = {

// prefs: null,
lastURL: '',

init: function() {
	// // Get handle to Mozilla preferences service
	// this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
	//   .getService(Components.interfaces.nsIPrefService)
	//   .getBranch("extensions.moodmusic.");
	// this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
	
	// // Add observer to "listen" for preference changes
	// this.prefs.addObserver("", this, false);
	
	var appcontent = document.getElementById("appcontent");   // browser
	if (appcontent) {
		appcontent.addEventListener("DOMContentLoaded", moodmusicobj.onPageLoad, true);
	}
},

/**
 * Returns the URL of the website currently displayed in the browser. 
 */
getCurrentURL: function() {
	return window.content.document.location.href;
},

updateLastURL: function() {
	moodmusicobj.lastURL = window.content.document.location.href;
},

refreshPopup: function() {
	var playerFrame = document.getElementById('playerFrame');
	// playerFrame.contentWindow.location.reload();
	var moodmusicMenu = document.getElementById("moodmusic-menu");
	moodmusicMenu.openPopup();
	moodmusicMenu.hidePopup();
},

createPlayerURL: function(data) {
	var numSongs = data.length;
	var playerURL = 'http://localhost:8000/hello-web-playback/player.html?';	
	for (var count = 0; count < numSongs; ++count) {
		playerURL += 'ID=' + data[count] + '&';
	}
	// trim final '&' or '?' from the end of playerURL
	playerURL = playerURL.substring(0, playerURL.length-1);
	return playerURL;
},

onPageLoad: function(aEvent) {
	var url = moodmusicobj.getCurrentURL();
	if (url != moodmusicobj.lastURL) {
		moodmusicobj.updateLastURL();
		TextExtractor.getDocumentText(url, function(data) {
			console.log("Got document data: ", data);
			SongChooser.chooseSongs(utils.getTextStructure(data.text), function(data) {
				console.log("Got songs: " + data);
				playerURL = moodmusicobj.createPlayerURL(data);
				var playerFrame = document.getElementById('playerFrame');
				playerFrame.setAttribute('src', playerURL);
				moodmusicobj.refreshPopup();
			}, handleFailureMessage);
		}, handleFailureMessage);
	}
},

playMusic: function() {
  // TODO: implement
	// var curURL = this.getCurrentURL();
	// var trimText = TextExtractor.getDocumentText(curURL);
}

};

window.addEventListener("load", function load(event){
  window.removeEventListener("load", load, false); //remove listener, no longer needed
  moodmusicobj.init();
}, false);
