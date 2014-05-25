var utils = {

__getNonEmpty: function(elements) {
  var goodElements = [];
  for (var i = 0; i < elements.length; ++i) {
    var e = $.trim(elements[i]);
    if (e.length > 0) {
      goodElements.push(e);
    }
  }
  return goodElements;
},

__getWordCounts: function(words) {
  var wordCounts = {};
  for (var i = 0; i < words.length; ++i) {
    var word = words[i];
    if (wordCounts[word]) wordCounts[word]++;
    else wordCounts[word] = 1;
  }
  return wordCounts;
},

__getWordDistribution: function(words) {
  var distribution = {};
  for (var i = 0; i < words.length; ++i) {
    var wordLength = words[i].length;
    if (distribution[wordLength]) distribution[wordLength]++;
    else distribution[wordLength] = 1;
  }
  return distribution;
},

__getAverageWordLength: function(wordLengthDistribution) {
  var total = 0;
  var count = 0;
  for (var length in wordLengthDistribution) {
    total += length * wordLengthDistribution[length];
    count += wordLengthDistribution[length];
  }
  return (count > 0) ? total / count : 0;
},

__getNumberOfVowels: function(text) {
  var total = 0;
  for (var i = 0; i < text.length; ++i) {
    var c = text.charAt(i).toLowerCase();
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') total += 1;
  }
  return total;
},

__getFleschReadingEaseness: function(words, sentences, numSyllables) {
  var res = 206.835;
  if (sentences.length > 0) {
    res -= 1.015 * (words.length / sentences.length);
  }
  if (words.length > 0) {
    res -= 84.6 * (numSyllables / words.length);
  }
  return res;
},


getTextStructure: function(documentText) {
  documentText = documentText || "";
  var words = this.__getNonEmpty(documentText.split(/ |\.|,|\?|\!/i));
  var sentences = this.__getNonEmpty(documentText.split("."));
  var wordLengthDistribution = this.__getWordDistribution(words);
  var numVowels = this.__getNumberOfVowels(documentText);

  return {
    // The original document text.
    text: documentText, 
    // A list of the words in the document (can include duplicate words).
    words: words,
    // A dictionary mapping word to its number of occurrence.
    wordCounts: this.__getWordCounts(words),
    // A dictionary mapping wordLength to the number of words with that length.
    wordLengthDistribution: wordLengthDistribution,
    // The average word length in the document.
    averageWordLength: this.__getAverageWordLength(wordLengthDistribution),
    // A list of the sentences in the document.
    sentences: sentences,
    // Number of vowels in the text (approximation for number of syllables).
    numVowels: numVowels,
    // Flesch reading easeness score: 90-100 = 11 yr olds, 60-70 = 13 to 15 yr olds, 0-30 univ grads.
    fleschReadingEaseness: this.__getFleschReadingEaseness(words, sentences, 3*numVowels/4)
  };
},
};
