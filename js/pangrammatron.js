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

const Pangrammatron = (alphabet=[], inventory=[], language='en') => ({	
	files: {
		en: {
			lex: 'dictionaries/en/cmudict-0.7b.txt',
			phon: 'dictionaries/en/cmudict-0.7b.phones'
		}
	},
	language,
	alphabet,
	inventory,
	gatherPhones: () => null,
	updateAlphabet: alphabet => {
		this.alphabet = new Set();
		for (let i=0; i < alphabet.length; i++) {
			this.alphabet.add(alphabet[i]);
		}
	},
	updateLanguage: language => this.language = language,
	breakIntoWords: text => null,
	uniqueLetters: (words) => null,
	uniquePhones: (words) => null,
	howPangrammatic: text => {
		const foundLetters = new Set();
		for (letter of text) {
			if (this.alphabet.has(letter)) {
				foundLetters.add(letter);
			}
		}
		if (foundLetters.length >= this.alphabet.length) {
			return true;
		}
		return false;
	},
	howPanphonic: text => null,
	isPangram: text => null,
	isPanphone: text => null
});

pan = Pangrammatron();
pan.updateAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
console.log(pan.alphabet);
console.log(pan.howPangrammatic("The quick brown fox jumped over the lazy dogs."));
