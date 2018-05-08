const PhonesDictionary = require('./cmu-phones').PhonesDictionary;
const Pangrammatron = require('./pangrammatron').Pangrammatron;

// Input output demo written around Pangrammatron and CMU phones dictionary

// build phoneme and phone->lex dictionaries
phones = new PhonesDictionary();

// build Pangrammatron instance
pan = new Pangrammatron();
pan.setLanguage('en');
pan.setAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

// set up phones dictionary and entries dictionary before chaining pangram work
pan.initialize(() => phones.gatherPhones(), () => phones.gatherEntries()).then(() => {
	const sent0 = "The quick brown fox jumped over the lazy dog.";
	const sent1 = "The quick brown fox jumped over the lazy dogs.";
	const sent2 = "Hear in this short limerick's strains every sound which my language contains. / Could it be an illusion? / Pan phonic pro fusion? / Something linguists enjoy as a game?";
	console.log(`${sent0}\n -- This ${pan.isPangram(sent0) ? 'is' : 'is not'} a pangram.\n`);
	console.log(`${sent1}\n -- This ${pan.isPangram(sent1) ? 'is' : 'is not'} a pangram.\n`);
	console.log(`${sent2}\n -- This ${pan.isPanphone(sent2) ? 'is' : 'is not'} a panphone.\n`);
});
