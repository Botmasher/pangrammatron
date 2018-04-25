const PhonesDictionary = require('./cmu-phones').PhonesDictionary;
const Pangrammatron = require('.pangrammatron').Pangrammatron;

pan = new Pangrammatron();
const sent0 = "The quick brown fox jumped over the lazy dog.";
const sent1 = "The quick brown fox jumped over the lazy dogs.";
const sent2 = "Hear in this short limerick's strains every sound which my language contains. / Could it be an illusion? / Pan phonic pro fusion? / Something linguists enjoy as a game?";
pan.setAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
phones = new PhonesDictionary();
phones = new PhonesDictionary();
pan.initialize(() => phones.gatherPhones(), () => phones.gatherEntries()).then(() => {
	console.log(pan.isPanphone(sent0));
	console.log(pan.isPangram(sent0));
	console.log(pan.isPanphone(sent2));
});
