//require('isomorphic-fetch');
//require('es6-promise').polyfill();
const fs = require('fs');

// TODO break out text parser to access phones data through dedicated JS object
const loadPhones = (uri) => {
	const h = new XMLHttpRequest();
	h.open('GET', uri);
	h.onreadystatechange = () => {
		const txt = h.readyState === 4 && h.status === 200
			? h.responseText
			: null
		;
		return txt;
	};
	h.send(null);
}

class Pangrammatron {
	constructor(alphabet=[], inventory=[], language='en') {
		this.files = {
			en: {
				lex: 'dictionaries/en/cmudict-0.7b.txt',
				phon: 'dictionaries/en/cmudict-0.7b.phones'
			}
		};
		this.language = this.setLanguage(language);
		this.alphabet = this.setAlphabet(alphabet);
		this.inventory = this.setInventory(inventory);
	}
	
	gatherPhones(cb) {
		fs.readFile(`../${this.files.en.phon}`,
			(error, data) => {
				const inventory = new Set();
				for (let line of data.toString('utf-8').match(/[^\n]+/g)) {
					inventory.add(line.split('\t')[0]);
				}
				this.inventory = inventory;
				cb();
			}
		);
	}
	
	setAlphabet(alphabet) {
		// store character set from array or string
		this.alphabet = new Set();
		for (let i=0; i < alphabet.length; i++) {
			this.alphabet.add(alphabet[i]);
		}
		return this.inventory;
	}

	setInventory(inventory) {
		this.inventory = new Set();
		for (let i=0; i < inventory.length; i++) {
			this.inventory.add(alphabet[i]);
		}
		return this.inventory;
	}
	
	setLanguage(language) {
		if (language.length !== 2) return false;
		this.language = language;
	}
	
	breakIntoWords(text) {
		const words = text.toUpperCase().match(/[A-Z]+/g); 	// TODO handle contractions
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

	uniquePhones(words) {
		return null;
	}

	howPangrammatic(text) {
		const foundLetters = new Set();
		for (let letter of text.toUpperCase()) {
			this.alphabet.has(letter) && foundLetters.add(letter);
		}
		return foundLetters.size; 	// TODO separate method for returning alphabet size
	}

	howPanphonic(text) {
		return false;
	}
	
	isPangram(text) {
		const letterCount = this.howPangrammatic(text);
		return (letterCount >= this.alphabet.size);
	}

	isPanphone(text) {
		return false;
	}

}

pan = new Pangrammatron();
const sent0 = "The quick brown fox jumped over the lazy dog.";
const sent1 = "The quick brown fox jumped over the lazy dogs.";
pan.setAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
console.log(pan.isPangram(sent0));
console.log(pan.isPangram(sent1));
pan.gatherPhones(() => {
	console.log(pan.isPanphone(sent0));
	console.log(pan.isPanphone(sent1));
});
