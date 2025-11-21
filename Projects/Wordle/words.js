// TODO [CLEANUP]: Add more words, store in JSON instead of JS (load from JSON on page load/store loaded JS list in cache?)

// Well. I guess I'm going to make my own list of words lol
// I guess you don't want too many for Wordle, but you could just give more guesses lol
// Or add tools like "eliminate extra consonants" or "give me a vowel" kinda like Wheel of Fortune. Wait. Am I just making Wheel of Fortune

// TODO [FEATURE - MULTIPLE APPLICATIONS]: Create an overall dictionary? where words have different tags/variables (size = word.length or starts with = word[0], but there are other tags like "animal", "noun", "theme goes here", etc)

// 5 letter words
export function get5LetterWords() {
    return ["award", "birds", "braid", "brown", "cares", "clear", "clown", "crown", "drawn", "feast", "green", "guess", "horse", "house", "jaunt", "joker", "lucky", "means", "model", "money", "mouse", "paint", "ready", "radio", "roast", "raven", "reset", "start", "solve", "shoot", "sweet", "sweat", "swing", "three", "treat", "trunk", "votes", "write", "wrong", "words", "wordy"];
}

// 4 letter words
export function get4LetterWords() {
    return ["four", "test", "hour", "tour", "rest", "more", "word", "cave", "care", "bear", "bare", "tear", "year", "dude", "joke", "gold", "told"]
}

// 3 letter words
export function get3LetterWords() {
    return ["one", "two", "own", "fun", "run", "red", "ton", "con", "fox", "box", "ear", "net", "met", "jet", "pet", "vet", "get", "pun", "ode"];
}