const fs = require('fs');

// TODO store entries with multiple pronunciations (formatted in text with suffix '(n)')
// TODO redo path (the relative one breaks when run from any other dir e.g. node js/p~.js from ../)

class PhonesDictionary {
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
					console.log(JSON.stringify(this.phones));
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
						if (l_elems[0].match(/[\#\;\{\}]/g)) continue;
						sounds = l_elems && l_elems.length > 1 && l_elems[1].match(/[A-Z]([A-Z]?)/g)
							? l_elems.slice(1).map(phone => (
									phone.match(/[A-Z]([A-Z])?/g)[0]		// strip phones of trailing numbers
								))
							: []
						;
						// find and store real entries as 'word': [phone_0, ..., phone_n]
						if (sounds && sounds.length > 0 && this.phones.has(sounds[0])) {
							word = l_elems[0].match(/[A-Z]+/g)[0];
							this.entries[word] = sounds;
						}
					}
					console.log(JSON.stringify(this.entries));
					resolve(this.entries);
				}
			);
		});
	}
}

module.exports = {
	PhonesDictionary
};
