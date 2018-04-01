import re
import os

## pangram checker
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
		# TODO check and clean alphabet before storing (min: is defined, is a string, is not empty)
		try:
			self.alphabet = set(list(alphabet));
		except:
			raise TypeError("Cannot convert Pangrammatron alphabet into a set - try passing a string or list")

		# raw text lexicon mapping word entries to their phonetic transcriptions
		self.phones_lexicon = os.path.join(os.getcwd(), self.files[language]['lex'])

		# raw text list of phones
		self.phones_inventory = self.get_phones(os.path.join(os.getcwd(), self.files[language]['phones']))

		# TODO handle other languages and other dictionaries based on language
		self.language = language

	def get_phones (self, file):
		"""Parse and list all phones from the raw phones list"""
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
		"""Set a new alphabet"""
		self.alphabet = alphabet
		return self.alphabet

	def break_into_words (self, text):
		"""Split a text into words representing contiguous strings of characters in the stored alphabet"""
		regex = r'[^%s]+' % "".join(self.alphabet)
		words = re.compile(regex).split(text.upper())
		return words

	def unique_letters (self, words):
		"""Find every unique letter that occurs in a list of words"""

		letters = "".join(words)

		# use hash set to check for uniques
		found_unique_letters = set([])
		for letter in letters:
			if letter.upper() in self.alphabet or letter.lower() in self.alphabet:
				found_unique_letters.add(letter)

		return found_unique_letters

	def unique_phones (self, words):
		"""Find every unique phone that occurs in each transcribed word from a list of written words"""
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
					# line is not a formatted lexicon entry
					continue
				if l_word in words:
					# strip numbers from end of some phones
					for phone in l_phones:
						phoneme = "".join([c for c in phone if not c.isdigit()])
						found_unique_phones.add(phoneme)

		return found_unique_phones

	def how_pangrammatic (self, text):
		"""Calculate the ratio of letters in the text to total letters in the stored alphabet"""

		words = self.break_into_words (text)

		# memoized answer
		if "".join(words) in self.memo_letters:
			uniques = self.memo_letters["".join(words)]
		# calculated answer
		else:
			uniques = self.unique_letters (words)
			self.memo_letters["".join(words)] = uniques

		ratio = {'sample': len(uniques), 'total': len(self.alphabet)}

		return (ratio['sample'] / ratio['total'])

	def how_panphonic (self, text):
		"""Calculate the ratio of phones in the text to total phones in the stored inventory"""

		words = self.break_into_words (text)

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
		"""Determine whether a text sample contains all the letters in the stored alphabet"""
		ratio = self.how_pangrammatic(text)
		# whether every letter was found in text
		if ratio >= 1.0: return True
		return False

	def is_panphone (self, text):
		"""Determine whether a text sample contains all the phones in the stored inventory"""
		ratio = self.how_panphonic(text)
		# whether every phone was found in transcribed text
		if ratio >= 1.0: return True
		return False