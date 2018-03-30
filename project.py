import re
import os

## initialize an object to store an alphabet and a phones dictionary
class Pangrammatron:
	files = {
		'en': {
			'lex': 'dictionaries/en/cmudict-0.7b.txt',
			'phones': 'dictionaries/en/cmudict-0.7b.phones'
		}
	}
	memo_phones = {}
	memo_letters = {}

	def __init__ (self, alphabet, language='en'):
		# TODO check and clean alphabet before storing
			# if alphabet is string of characters, split into array
			# take array and check each character (min: is defined, is a string, is not empty)
		try:
			self.alphabet = set(list(alphabet));
		except:
			raise TypeError("Cannot convert Pangrammatron alphabet into a set - try passing a string or list")

		# TODO load phones dict from path
		self.phones_lexicon = os.path.join(os.getcwd(), self.files[language]['lex'])

		# TODO load phones list from path
		self.phones_inventory = self.get_phones(os.path.join(os.getcwd(), self.files[language]['phones']))

		# TODO handle other languages and other dictionaries based on language
		self.language = language

	def get_phones (self, file):
		phones = set([])
		with open(file, "r") as f:
			for l in f:
				segs = l.split()
				try:
					phones.add(segs[0])
				except:
					continue
		return phones

	def update_alphabet (self, alphabet):
		self.alphabet = alphabet
		return self.alphabet

	def break_into_words (self, text):
		regex = r'[^%s]+' % "".join(self.alphabet)
		words = re.compile(regex).split(text.upper())
		return words

	def unique_letters (self, words):
		# TODO split on self.alphabet's characters instead of fixed a-z
		letters = "".join(words)

		# use hash set to check for uniques
		found_unique_letters = set([])
		for letter in letters:
			if letter.upper() in self.alphabet or letter.lower() in self.alphabet:
				found_unique_letters.add(letter)

		return found_unique_letters

	def unique_phones (self, words):
		found_unique_phones = set([])
		words = set(words)
		if '' in words: words.remove('')

		with open(self.phones_lexicon, "r") as f:
			for l in f:
				try:
					l_elems = l.split()
					l_word = l_elems[0]
					l_phones = l_elems[1:]
				except:
					continue 	# line is not a formatted lexicon entry
				if l_word in words:
					# strip numbers from end of some phones
					for phone in l_phones:
						phoneme = "".join([c for c in phone if not c.isdigit()])
						found_unique_phones.add(phoneme)

		return found_unique_phones

	def how_pangrammatic (self, sentence):
		# TODO when asked how much of a pangram a sentence is
			# answer with the ratio of letters found to total letters in the alphabet

		# TODO consider doing main work here and calling from is_pangram
			# is_pangram will return True if ratio is 100%
			# memoize answer per sentence

		words = self.break_into_words (sentence)

		# memoized answer
		if "".join(words) in self.memo_letters:
			uniques = self.memo_letters["".join(words)]
		# calculated answer
		else:
			uniques = self.unique_letters (words)
			self.memo_letters["".join(words)] = uniques

		ratio = {'sample': len(uniques), 'total': len(self.alphabet)}

		return (ratio['sample'] / ratio['total'])

	def how_panphonic (self, sentence):
		# TODO when asked how much of a panphone a sentence is
			# answer with the ratio of phones found to total phones in the language

		# TODO consider doing main work here and calling from is_panphone
			# is_panphone will return True if ratio is 100%
			# memoize answer per sentence

		words = self.break_into_words (sentence)

		# memoized answer
		if "".join(words) in self.memo_phones:
			uniques = self.memo_phones["".join(words)]
		# calculated answer
		else:
			uniques = self.unique_phones (words)
			self.memo_phones["".join(words)] = uniques

		ratio = {'sample': len(uniques), 'total': len(self.phones_inventory)}

		return (ratio['sample'] / ratio['total'])

	def is_pangram (self, text):
		# TODO when asked if a sentence is a pangram
			# uncaps sentence - actually check if upper or lower match alphabet since alphabet can have either
			# use regex to break sentence into words
			# answer True if every letter in self.alphabet is in the sentence
			# answer False otherwise

		# TODO memoize answer

		# whether every letter was found in text
		ratio = self.how_pangrammatic(text)

		if ratio >= 1.0: return True
		return False

	def is_panphone (self, text):
		# TODO when asked if a sentence is a panphone
			# caps sentence (for CMU dict)
			# use regex to break sentence into words
			# break words into phonemes
			# iterate through phonemes
			# answer True if every phone in self.phones_dict is in the sentence
			# answer False otherwise
		# TODO if answer is memoized and is 100%, return True

		ratio = self.how_panphonic(text)
				
		# whether every letter was found in text
		if ratio >= 1.0: return True
		return False

if __name__ == '__main__':
	pan = Pangrammatron("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
	print(pan.is_pangram("The quick brown fox jumped over the lazy dog."))
	print(pan.how_pangrammatic("The quick brown fox jumped over the lazy dog."))
	print(pan.is_pangram("The quick brown fox jumped over the lazy dogs."))
	print(pan.how_pangrammatic("The quick brown fox jumped over the lazy dogs."))
	print(pan.is_panphone("The quick brown fox jumped over the lazy dog."))
	print(pan.how_panphonic("The quick brown fox jumped over the lazy dog."))