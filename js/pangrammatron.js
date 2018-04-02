// TODO break out text parser to access phones data through dedicated JS object
const loadPhones = (filePath, fileName) => {
	const raw = new XMLHttpRequest();
	raw.open('GET', `file:///${filePath}/${fileName}`, false);
	raw.onreadystatechange = () => {
		const txt = raw.readyState === 4 && (raw.status === 0 || raw.status === 200)
			? raw.responseText
			: null
		;
		return txt;
	};
	rawFile.send(null);
}

class Pangrammatron {
	constructor(alphabet=[], inventory=[], language='en') {
		this.files = {
			en: {
				lex: 'dictionaries/en/cmudict-0.7b.txt',
				phon: 'dictionaries/en/cmudict-0.7b.phones'
			}
		};
		this.language = language;
		this.alphabet = alphabet;
		this.inventory = inventory;
	}
	
	gatherPhones() {
		return null;
	}
	
	updateAlphabet(alphabet='') {
		this.alphabet = new Set();
		for (let i=0; i < alphabet.length; i++) {
			this.alphabet.add(alphabet[i]);
		}
	}
	
	updateLanguage(language) {
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
		return null;
	}
	
	isPangram(text) {
		const letterCount = this.howPangrammatic(text);
		return (letterCount >= this.alphabet.size);
	}

	isPanphone(text) {
		return null;
	}

}

pan = new Pangrammatron();
pan.updateAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
console.log(pan.isPangram("The quick brown fox jumped over the lazy dog."));
console.log(pan.howPangrammatic("The quick brown fox jumped over the lazy dog."));
console.log(pan.breakIntoWords("The quick brown fox jumped over the lazy dog."));
console.log(pan.isPangram("The quick brown fox jumped over the lazy dogs."));
console.log(pan.howPangrammatic("The quick brown fox jumped over the lazy dogs."));
