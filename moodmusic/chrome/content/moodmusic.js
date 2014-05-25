function handleFailureMessage(msg) {
  alert(msg);
}

var moodmusicobj = {

// prefs: null,

init: function() {
	// // Get handle to Mozilla preferences service
	// this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
		// .getService(Components.interfaces.nsIPrefService)
		// .getBranch("extensions.moodmusic.");
	// this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
	
	// // Add observer to "listen" for preference changes
	// this.prefs.addObserver("", this, false);
	
	var appcontent = document.getElementById("appcontent");   // browser
	if(appcontent){
		appcontent.addEventListener("DOMContentLoaded", moodmusicobj.onPageLoad, true);
	}
},

/***
getCurrentURL() returns the URL of the website currently displayed in the browser.
***/
getCurrentURL: function()
{
	return window.content.document.location.href;
},

onPageLoad: function(aEvent) {
	var url = moodmusicobj.getCurrentURL();
	TextExtractor.getDocumentText(url, function(data) {
		console.log("Got document data: ", data);
		SongChooser.chooseSongs(utils.getTextStructure(data.text), function(data) {
			console.log("Got songs: " + data);
			playerURL = moodmusicobj.createPlayerURL(data);
			var playerFrame = document.getElementById('playerFrame');
			playerFrame.setAttribute('src', playerURL);
			// SongPlayer.playSongs(data);
		}, handleFailureMessage);
	}, handleFailureMessage);
	
	moodmusicobj.autoPlay();
},

autoPlay: function()
{
	playerFrame = document.getElementById('playerFrame');
	playerFrame.contentWindow.location.reload();
	moodmusicMenu = document.getElementById("moodmusic-menu");
	moodmusicMenu.openPopup();
	moodmusicMenu.hidePopup();
},

createPlayerURL: function(data)
{
	numSongs = data.length;
	var count = 0;
	var playerURL = 'http://localhost:8000/player.html?';
	
	while(count < numSongs)
	{
		playerURL = playerURL + 'ID=' + data[count] + '&';
		count++;
	}
	
	// trim final '&' or '?' from the end of playerURL
	playerURL = playerURL.substring(0, playerURL.length-1);
	
	return playerURL;
},

playMusic: function()
{
	var curURL = this.getCurrentURL();
	var trimText = TextExtractor.getDocumentText(curURL);
}
};
	
window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    moodmusicobj.init();
},false);