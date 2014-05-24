var TextExtractor = {

/* var jsFiddleConsole = function() {
    return({
        log: function(msg) {
          consoleDiv = document.getElementById('console');
          para = document.createElement('p');
          text = document.createTextNode(msg);
          para.appendChild(text);
          consoleDiv.appendChild(para);
        }
    });
}(); */

getDocumentText: function(url) {
    
    //jsFiddleConsole.log(url);
	//getWords(currentUrl);
	var apiUrl = "http://api.diffbot.com/v2/article?token=4ba94ea8bdd8300d76961b5888cf46f1"
					+ "&url=" + escape(url);

    //jsFiddleConsole.log(url);
	  $.get(apiUrl, function(data) {
          // jsFiddleConsole.log(url);
		  console.log(url)
	  var extractedJSONText = JSON.stringify(data, undefined, 2);
          // jsFiddleConsole.log(extractedJSONText);
          // console.log(extractedJSONText);
		  // alert(data.text);
	  return data.text;
	});
}

};