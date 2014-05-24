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

chooseSongs: function(textStructure, successCallback, failureCallback) {
  console.log("The document text structure: ", textStructure);
  var sortedMoods = this.__getMoods(textStructure);
  console.log("Good moods: ", sortedMoods);
  if (sortedMoods.length > 0) {
    console.log("Best mood: ", sortedMoods[0].mood, sortedMoods[0].count);
  }



  successCallback('awesome song');
}

};
