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

// TODO include memo

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
		return new Promise((resolve, reject) => {
			fs.readFile(`../${this.files.en.phon}`,
				(error, data) => {
					const inventory = new Set();
					for (let line of data.toString('utf-8').match(/[^\n]+/g)) {
						inventory.add(line.split('\t')[0]);
					}
					this.inventory = inventory;
					resolve(this.inventory);
				}
			);
		});
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
		if (!this.inventory || this.inventory.size < 1) return;
		
		const words = text.toUpperCase().match(/[A-Z]+/g);

		return new Promise((resolve, reject) => {
			fs.readFile(`../${this.files.en.lex}`,
				(error, data) => {
					const phones = new Set();
					for (let line of data.toString('utf-8').match(/[^\n]+/g)) {
						const l_elems = line.match(/[^ \t]+/g);
						if (l_elems && l_elems.length > 1 && words.includes(l_elems[0])) {
							l_elems.slice(1, l_elems.length).map(phone => phones.add(phone));
						}
					}
					resolve(phones);
				}
			);
		});

		// with open(self.phones_lexicon, "r") as f:
		// 	for l in f:
		// 		try:
		// 			l_elems = l.split()
		// 			l_word = l_elems[0]
		// 			l_phones = l_elems[1:]
		// 		except:
		// 			# line is not a formatted lexicon entry
		// 			continue
		// 		if l_word in words:
		// 			# strip numbers from end of some phones
		// 			for phone in l_phones:
		// 				phoneme = "".join([c for c in phone if not c.isdigit()])
		// 				found_unique_phones.add(phoneme)
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
const sent1 = "The quick brown fox jumped over the lazy dogs.";
pan.setAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
console.log(pan.isPangram(sent0));
console.log(pan.isPangram(sent1));
pan.gatherPhones().then(() => {
	pan.isPanphone(sent0).then(count => console.log(count));
	pan.isPanphone(sent1).then(count => console.log(count)).then(()=> {
		pan.howPanphonic(sent1).then(phones => console.log(phones.size/pan.inventory.size));
	});
});
