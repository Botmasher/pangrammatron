// TODO raise error when panphonic dictionary searched using unknown word (including "PANPHONIC")

class Pangrammatron {
	constructor(alphabet=[], inventory=[], dictionary={}, language='en') {
		this.setLanguage(language);
		this.setAlphabet(alphabet);
		this.setInventory(inventory);
		this.setDictionary(dictionary);
		this.memo = {
			phones: {},
			grams: {}
		};
	}

	initialize(gatherPhones, gatherEntries) {
		return gatherPhones().then((inventory) => gatherEntries().then((entries) => {
			this.setInventory(inventory);
			this.setDictionary(entries);
		}));
	}
	
	setAlphabet(alphabet) {
		// store character set from array or string
		const new_alphabet = new Set();
		for (let i=0; i < alphabet.length; i++) {
			new_alphabet.add(alphabet[i]);
		}
		this.alphabet = new_alphabet;
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

	setInventory(inventory=new Set()) {
		this.inventory = inventory;
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
		// }
		return phones;
	}

	howPangrammatic(text) {
		if (!this.alphabet) throw "No alphabet defined before calling Pangrammatron.howPangrammatic"

		const words = text.toUpperCase().match(/([A-Z](\'[A-Z]+)?)+/g); 	
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
		const words = text.toUpperCase().match(/([A-Z]+(\'[A-Z]+)?)/g);	
		const cleanedText = words.join();

		if (this.memo.phones.cleanedText) return (this.memo.phones.cleanedText);

		const phones = new Set();

		let formatted_phones = [];
		let formatted_word = '';

		for (let word of words) {
			if (!this.dictionary[word]) {
				if (word.includes('\'') && this.dictionary[word.match(/[A-Z]+/g)[0]]) {
					formatted_word = word.match(/[A-Z]+/g)[0];
					if (!this.dictionary[formatted_word]) continue;
				} else {
					continue;
				}
			} else {
				formatted_word = word;
			}
			for (let sound of this.dictionary[formatted_word]) {
				formatted_phones = sound.match(/[^\d]+/g);
				phones.add(formatted_phones[0]);
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
		const phones = this.howPanphonic(text);
		// check for missing phones
		// for (let ph of this.inventory) {
		// 	!phones.has(ph) && console.log(ph);
		// }
		return (phones.size >= this.inventory.size);
	}
}

module.exports = {
	Pangrammatron
};
