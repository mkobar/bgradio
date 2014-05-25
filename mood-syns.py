from nltk.corpus import wordnet
from collections import defaultdict

moods = ["aggressive", "ambient", "angry", "angst-ridden", "bouncy", "calming", "carefree", "cheerful", "cold", "complex", "cool", "dark", "disturbing", "dramatic", "dreamy", "eerie", "elegant", "energetic", "enthusiastic", "epic", "fun", "funky", "futuristic", "gentle", "gleeful", "gloomy", "groovy", "happy", "harsh", "haunting", "humorous", "hypnotic", "industrial", "intense", "intimate", "joyous", "laid-back", "light", "lively", "manic", "meditation", "melancholia", "mellow", "mystical", "ominous", "party music", "passionate", "pastoral", "peaceful", "playful", "poignant", "quiet", "rebellious", "reflective", "relax", "romantic", "rowdy", "sad", "sentimental", "sexy", "smooth", "soothing", "sophisticated", "spacey", "spiritual", "strange", "sweet", "theater", "trippy", "warm", "whimsical"]
#print moods

mood_syns = defaultdict(list)
for mood in moods:
    for synset in wordnet.synsets(mood):
        mood_syns[mood] += synset.lemma_names

res = []
for word, syns in mood_syns.items():
    for syn in syns:
        res.append("\"%s\": \"%s\"" % (syn, word))
print ',\n'.join(res)

