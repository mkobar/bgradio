// Depends on mood-synonyms.js, utils.js

var SongChooser = {

__getMoods: function(textStructure) {
  var goodMoods = {};
  for (var word in textStructure.wordCounts) {
    if (MoodSynonyms[word]) {
      var mood = MoodSynonyms[word];
      if (goodMoods[mood]) goodMoods[mood] += textStructure.wordCounts[word];
      else goodMoods[mood] = textStructure.wordCounts[word];
    }
  }

  var goodMoodCounts = [];
  for (var mood in goodMoods) {
    goodMoodCounts.push({ mood: mood, count: goodMoods[mood] });
  }

  goodMoodCounts.sort(function(a, b) { return b.count - a.count; });
  return goodMoodCounts;
},

__doEchoNestSearch: function(params, successCallback, failureCallback) {
  params["api_key"] = "ZPWVUT2WEUOBYE8KI";
  $.ajax({
    url: "http://developer.echonest.com/api/v4/song/search?bucket=id:rdio-US&bucket=tracks",
    data: params,
    type: "GET",
    dataType: "json",
    success: successCallback,
    error: function(data, statusText, request) {
      failureCallback("Error when search echonest for: " + statusText);
    }
  });
},

chooseSongs: function(textStructure, successCallback, failureCallback) {
  console.log("The document text structure: ", textStructure);
  var sortedMoods = this.__getMoods(textStructure);
  console.log("Good moods: ", sortedMoods);
  if (sortedMoods.length > 0) {
    console.log("Best mood: ", sortedMoods[0].mood, sortedMoods[0].count);
  } else {
    sortedMoods.push('happy');  // default mood is happy :)
  }

  var searchParams = {
    mood: sortedMoods[0].mood,
    song_type: "live:false",
    min_duration: 60,
    max_tempo: 300,
    sort: "song_hotttnesss-desc",
    limit: true,
    format: "json"
  };

  this.__doEchoNestSearch(searchParams, function(data) {
    var extractedJSONText = JSON.stringify(data, undefined, 2);
    var jsonObject = eval('(' + extractedJSONText + ')');
    // console.log(jsonObject.response.songs[2].artist_foreign_ids[0].foreign_id);
    
    var count = 0;
    var songIds = [];
    
    while (count < jsonObject.response.songs.length) {
      var count2 = 0;
      var sizeOfTracks = jsonObject.response.songs[count].tracks.length;
      
      if (jsonObject.response.songs[count].tracks != 0) {
        //console.log("length is good");
        while (count2 < sizeOfTracks) {
          if (jsonObject.response.songs[count].tracks[count2].foreign_id != null && 
              jsonObject.response.songs[count].tracks[count2].foreign_id != "") {
            //console.log(jsonObject.response.songs[count].tracks[count2].foreign_id);
            var tempRdioTrackId = jsonObject.response.songs[count].tracks[count2].foreign_id;
            var res = tempRdioTrackId.substring(14, tempRdioTrackId.length); 
            //rdio-US:track:t9538967
            songIds.push(res);
          }
          count2++;
        }
      }
      count++;
    }
    console.log("Tracks found: " + jsonObject.response.songs.length);
    successCallback(songIds);
  }, failureCallback);
}

};
