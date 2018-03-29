import re

## initialize an object to store an alphabet and a phones dictionary
class Pangrammatron:
	def __init__ (self, alphabet, phones_dict_path="", phones_list_path="", language="English"):
		# TODO check and clean alphabet before storing
			# if alphabet is string of characters, split into array
			# take array and check each character (min: is defined, is a string, is not empty)
		self.alphabet = alphabet;

		# TODO load phones dict from path
		self.phones_dict = None

		# TODO load phones list from path
		self.phones_list = None

		# TODO handle other languages and other dictionaries based on language
		self.language = language

	def is_pangram (self, sentence):
		# TODO when asked if a sentence is a pangram
			# uncaps sentence
			# use regex to break sentence into words
			# answer True if every letter in self.alphabet is in the sentence
			# answer False otherwise
		# TODO if answer is memoized and is 100%, return True
		return None

	def is_panphone (self, sentence):
		# TODO when asked if a sentence is a panphone
			# caps sentence (for CMU dict)
			# use regex to break sentence into words
			# break words into phonemes
			# iterate through phonemes
			# answer True if every phone in self.phones_dict is in the sentence
			# answer False otherwise
		# TODO if answer is memoized and is 100%, return True
		return None

	def how_pangrammatic (self, sentence):
		# TODO when asked how much of a pangram a sentence is
			# answer with the ratio of letters found to total letters in the alphabet

		# TODO consider doing main work here and calling from is_pangram
			# is_pangram will return True if ratio is 100%
			# memoize answer per sentence
		return None

	def how_panphonic (self, sentence):
		# TODO when asked how much of a panphone a sentence is
			# answer with the ratio of phones found to total phones in the language

		# TODO consider doing main work here and calling from is_panphone
			# is_panphone will return True if ratio is 100%
			# memoize answer per sentence
		return None

if __name__ == "__main__":
	pan = Pangrammatron("asdf") # or ["a", "s", "d", "f"]
	pan.is_pangram("fads")
