function handleFailureMessage(msg, data) {
  console.error(msg);
  console.error(data);
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
	var moodmusicMenu = document.getElementById("moodmusic-menu");
	moodmusicMenu.openPopup();
	moodmusicMenu.hidePopup();
},

createPlayerURL: function(songIDs, moodText) {
	var numSongs = songIDs.length;
	var playerURL = 'http://localhost:8000/hello-web-playback/player.html?';	
	
	// add Song IDs to URL
	for (var count = 0; count < numSongs; ++count) {
		playerURL += 'ID=' + songIDs[count] + '&';
	}
	
	// add moodText to URL
	playerURL += 'mood=' + encodeURIComponent(moodText);
	
	// trim final '&' or '?' from the end of playerURL
	// playerURL = playerURL.substring(0, playerURL.length-1);
	
	return playerURL;
},

onPageLoad: function(aEvent) {
	var url = moodmusicobj.getCurrentURL();
	if (url != moodmusicobj.lastURL) {
		moodmusicobj.updateLastURL();
		TextExtractor.getDocumentText(url, function(data) {
			console.log("Got document data: ", data);
			SongChooser.chooseSongs(data, utils.getTextStructure(data.text), function(songIDs, moodText) {
				console.log("Got songs: " + songIDs);
				var playerURL = moodmusicobj.createPlayerURL(songIDs, moodText);
				var playerFrame = document.getElementById('playerFrame');
				playerFrame.setAttribute('src', playerURL);
				moodmusicobj.refreshPopup();
			}, handleFailureMessage);
		}, handleFailureMessage);
	}
},

isPopupTransition: false,

resetFrameWidth: function() {
	// if (!this.isPopupTransition) {
		// m = document.getElementById('moodmusic-menu');
		// p = document.getElementById('playerFrame');
		// m.hidePopup();
		
		// p.style.width = '0px';
		// console.log(p.style.width);
		// p.style.width = '294px';
		// console.log(p.style.width);
		// this.isPopupTransition = true;
		// m.openPopup();
		// this.isPopupTransition = false;
	// }
},

playMusic: function() {
	p = document.getElementById('playerFrame');
	$('#toggleplay', p.contentWindow.document).click();
}

};

window.addEventListener("load", function load(event){
  window.removeEventListener("load", load, false); //remove listener, no longer needed
  moodmusicobj.init();
}, false);
