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

export const Pangrammatron = {
	files: {
		en: {
			lex: 'dictionaries/en/cmudict-0.7b.txt',
			phon: 'dictionaries/en/cmudict-0.7b.phones'
		}
	},
	language: '',
	alphabet: [],
	inventory: [],
	gatherPhones: () => null,
	updateAlphabet: alphabet => this.alphabet = alphabet,
	updateLanguage: language => this.language = language,
	breakIntoWords: text => null,
	uniqueLetters: (words) => null,
	uniquePhones: (words) => null,
	howPangrammatic: text => null,
	howPanphonic: text => null,
	isPangram: text => null,
	isPanphone: text => null
};
