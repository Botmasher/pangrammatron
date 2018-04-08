//require('isomorphic-fetch');
//require('es6-promise').polyfill();
const fs = require('fs');

// TODO break out text parser to access phones data through dedicated JS object

class CMUPhonesDictionary {
	constructor() {
		this.paths = {
			en: {
				lex: 'dictionaries/en/cmudict-0.7b.txt',
				phon: 'dictionaries/en/cmudict-0.7b.phones'
			}
		};
		this.phones = {};
		this.entries = {};
	}

	gatherPhones(cb) {
		return new Promise((resolve, reject) => {
			fs.readFile(`../${this.paths.en.phon}`,
				(error, data) => {
					const phones = new Set();
					for (let line of data.toString('utf-8').match(/[^\n]+/g)) {
						phones.add(line.split('\t')[0]);
					}
					this.phones = phones;
					resolve(this.phones);
				}
			);
		});
	}

	gatherEntries() {
		return new Promise((resolve, reject) => {
			fs.readFile(`../${this.paths.en.lex}`,
				(error, data) => {
					const phones = new Set();
					let word = '';
					let sounds = [];
					// search lines for formatted entries
					for (let line of data.toString('utf-8').match(/[^\n]+/g)) {
						const l_elems = line.match(/[^ \t]+/g);
						// find and store real entries as 'word': [phone_0, ..., phone_n]
						if (l_elems && l_elems.length > 1 && this.phones.has(l_elems[1])) {
							word = l_elems[0];
							sounds = l_elems.slice(1, l_elems.length);
							this.entries[word] = sounds;
						}
					}
					resolve(this.entries);
				}
			);
		});
	}
}

// TODO redo path (the relative one breaks when run from any other dir e.g. node js/p~.js from ../)

class Pangrammatron {
	constructor(alphabet=[], inventory=[], dictionary={}, language='en') {
		this.language = this.setLanguage(language);
		this.alphabet = this.setAlphabet(alphabet);
		this.inventory = inventory;
		this.dictionary = dictionary;
		this.memo = {
			phones: {},
			grams: {}
		};
	}
	
	setAlphabet(alphabet) {
		// store character set from array or string
		this.alphabet = new Set();
		for (let i=0; i < alphabet.length; i++) {
			this.alphabet.add(alphabet[i]);
		}
		return this.inventory;
	}

	getAlphabet() {
		return this.alphabet;
	}

	getInventory() {
		return this.inventory;
	}

	getDictionary() {
		return this.dictionary;
	}

	countAlphabet() {
		return this.alphabet.size;
	}

	countInventory() {
		return this.inventory.size;
	}

	setInventory(inventory) {
		this.inventory = new Set();
		for (let i=0; i < inventory.length; i++) {
			this.inventory.add(alphabet[i]);
		}
		return this.inventory;
	}
	
	setDictionary(dictionary) {
		this.dictionary = dictionary;
	}

	setLanguage(language) {
		if (language.length !== 2) return false;
		this.language = language;
	}
	
	breakIntoWords(text) {
		const words = text.toUpperCase().match(/([A-Z](\'[A-Z]+)?)+/g);
		const splitText = text.trim().split(" ");
		return new Set(words);
	}

	uniqueLetters(words) {
		const foundLetters = new Set();
		for (let letter of words.join()) {
			this.alphabet.has(letter) && foundLetters.add(letter);
		}
		return foundLetters;
	}

	// TODO revisit after phones inventory and lexicon parser-builder is in place
	uniquePhones(words) {
		const phones = new Set();
		// for (let word of words) {
		// 	this.phonesLex.word && this.phonesLex.word.length > 0 && this.phonesLex.word.map(phone => phones.add(phone));
		// 	}
		// }
		return phones;
	}

	howPangrammatic(text) {
		if (!this.alphabet) throw "No alphabet defined before calling Pangrammatron.howPangrammatic"

		const words = text.toUpperCase().match(/([A-Z](\'[A-Z]+)?)+/g); 	
		console.log(words);
		const cleanedText = words.join();

		if (this.memo.grams.cleanedText) return this.memo.grams.cleanedText.size;

		const foundLetters = new Set();
		for (let letter of text.toUpperCase()) {
			this.alphabet.has(letter) && foundLetters.add(letter);
		}
		this.memo.grams[cleanedText] = foundLetters;
		return foundLetters.size; 	// TODO separate method for returning alphabet size
	}

	howPanphonic(text) {
		if (!this.inventory) throw "No inventory defined before calling Pangrammatron.howPanphonic";
		
		// split and scrub text
		const words = text.toUpperCase().match(/([A-Z](\'[A-Z]+)?)+/g); 	
		console.log(words);
		const cleanedText = words.join();

		if (this.memo.phones.cleanedText) return (this.memo.phones.cleanedText);

		const phones = new Set();

		for (let word of words) {
			if (!this.dictionary[word]) continue;
			for (let sound of this.dictionary[word]) {
				phones.add(sound);
			}
		}

		// save solution
		this.memo.phones[cleanedText] = phones;

		return (phones);
	}
	
	isPangram(text) {
		const letterCount = this.howPangrammatic(text);
		return (letterCount >= this.alphabet.size);
	}

	isPanphone(text) {
		if (!this.inventory || this.inventory.size < 1) return;
		const phonesPromise = this.howPanphonic(text);
		return phonesPromise.then(phoneCount => (phoneCount >= this.inventory.size));
	}
}

pan = new Pangrammatron();
const sent0 = "The quick brown fox jumped over the lazy dog.";
const sent1 = "The quick brown fox jumped over the lazy dog's.";
pan.setAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
cmu = new CMUPhonesDictionary();
cmu.gatherPhones().then((inventory) => cmu.gatherEntries().then((entries) => {
	pan.setInventory(inventory);
	pan.setDictionary(entries);
	console.log(pan.isPanphone(sent0));
	console.log(pan.isPanphone(sent1));
}));