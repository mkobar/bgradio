var TextExtractor = {

var show = "shown";

getDocumentText: function(url, successCallback, failureCallback) {

	var apiUrl = "http://api.diffbot.com/v2/article?token=4ba94ea8bdd8300d76961b5888cf46f1" +
	  "&url=" + escape(url);

	$.get(apiUrl, function(data, textStatus, jqXHR) {
    if (data.error) {
      failureCallback("Error: " + data.errorCode);
    }
    successCallback(data);
	}).fail(function(data, textStatus) {
    failureCallback("Error: " + textStatus)
  });
}

};