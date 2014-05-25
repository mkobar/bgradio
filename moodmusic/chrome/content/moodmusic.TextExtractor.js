var TextExtractor = {

getDocumentText: function(url, successCallback, failureCallback) {

  var token = "4ba94ea8bdd8300d76961b5888cf46f1";
	var apiUrl = "http://api.diffbot.com/v2/article?token=" + token + "&url=" + escape(url) +
    "&fields=title,text,tags&paging=false";

	$.get(apiUrl, function(data, textStatus, jqXHR) {
    if (data.error) {
      failureCallback("Error (" + data.errorCode + "): " + textStatus, data);
    }
    successCallback(data);
	}).fail(function(data, textStatus) {
    failureCallback("Error: " + textStatus, data)
  });
}

};
