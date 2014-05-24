var moodmusicobj = {

// prefs: null,

init: function() {
	var appcontent = document.getElementById("appcontent");   // browser
	if(appcontent){
		appcontent.addEventListener("DOMContentLoaded", this.onPageLoad, true);
	}
},

onPageLoad: function(aEvent) {
	document.getElementById('playerFrame').contentWindow.location.reload();
	moodmusicMenu = document.getElementById("moodmusic-menu");
	moodmusicMenu.openPopup();
	moodmusicMenu.hidePopup();
},

getCurrentUrl: function()
{
	return window.content.document.location.href;
},

playMusic: function()
{
	var curUrl = this.getCurrentUrl();
	// console.log(curUrl);
	var trimText = TextExtractor.getDocumentText(curUrl);
}

// autoPlay: function()
// {
	// moodmusicMenu = document.getElementById("moodmusic-menu");
	// moodmusicMenu.openPopup();
	// moodmusicMenu.hidePopup();
// }

/* getText: function()
{
	currentURL = window.content.document.location;
	
	var apiUrl = "http://api.diffbot.com/v2/article?token=4ba94ea8bdd8300d76961b5888cf46f1" +
		"&url=" + escape(currentURL);
	console.log(apiUrl);
	
	$.get(apiUrl, function(data) {
		var doc = window.content.document;
		var body = doc.getElementsByTagName("body")[0];
		var pre = doc.createElement("pre");
		pre.innerHTML = JSON.stringify(data, undefined, 2);
		body.appendChild(pre);
	});
} */
};
	
window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    moodmusicobj.init();  
},false);