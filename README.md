# Pangrammatron

Test if a sentence is a written or spoken pangram... and just how much of a pangram it is!

## What's a pangram?

When a written sentence contains every letter of an alphabet, it's a **pangram**. For this project, I'm trying to identify two types of pangrams:
1. **graphemic pangram**: a sentence with at least one instance of every letter in a written language
2. **phonemic pangram**: a sentence with at least one instance of every phoneme used in a spoken language

I'll also refer to the last one with the term "panphone", since instead of _grams_ (letters) it focuses on all _phones_ (sounds).

## Why build this?

I'm going through some coursework on natural language processing. One of the quizzes just asked me to identify which in a list of sentences were phonetic versus graphemic pangrams. Rather than use intuition or compute them by hand, I decided to build a project that solves the problem for me and maybe someone else down the road.

## Getting Started

You'll be able to get Pangrammatron running simply by copying files and executing the main script. The tool you'll use to execute this project depends on the implementation you choose: JS or Python.

### Node/JavaScript

The JavaScript version of this project was developed with web work in mind. You can test it locally using Node:
- make sure you have [Node](https://nodejs.org/en/) installed
- download, fork or clone this repository
- navigate to the local project directory
- open the `js/` subdirectory
- run the demo with Node: `node demo.js`

If you get error-free results printed to your console or terminal, you're ready to develop. When you open the `run.js` demo, you'll see a straightforward flow for interacting with Pangrammatron:
1. instantiate the phones dictionary manager
	- right now just the English CMU phones list and lex->phones map are available
2. instantiate Pangrammatron
3. async hook up a phones and an entries source for Pangrammatron
	- the instantiated phones dictionary manager has async methods to load both
4. chain pangram or panphone checks onto the return once entries are loaded

### Python

There is also a Python version of the project that relies on the same dictionaries and should return the same results. This was the first implementation of Pangrammatron.

Here's a way to get the Python version up and running locally:
- make sure you have [Python](https://www.python.org/) installed
- download, fork or clone this repository
- navigate to the local project directory
- open the `python/` subdirectory
- run the main `project.py` file with Python
	- try `python3 project.py`
	- the project will run a simple text UI
	- type a sentence or select `q` to quit at the prompt
	- press <kbd>Return</kbd> to see results

Note that the project was developed with Python 3. It crashes at `input` in earlier versions.

## Making Use of Pangrammatron

Here are some other ways to make use of Pangrammatron.

- Interact with Pangrammatron directly:
	- edit the demo execution in `project.py` or `demo.js`
	- call one or more of the Pangrammatron instance methods

- Include Pangrammatron in a Python project or package:
	- get a copy of the `pangrammatron.py` class file
	- include the class somehow, such as `from pangrammatron import Pangrammatron`
	- the exact steps depend on your [project structure](https://docs.python.org/3/tutorial/modules.html)
	- instantiate Pangrammatron
	- call one or more methods

- Include Pangrammatron in your web project:
	- JavaScript support is now in alpha :)
	- the latest sketch of that code lives in `./js`
	- see `demo.js` for an example of how to interact with Pangrammatron

- Change the behavior of Pangrammatron:
	- edit the pangram/panphone calculation in `pangrammatron.py` or `pangrammatron.js`

- Change the phones and lex->phones sources:
	- the `js/` version lives separately in `cmu-phones.js`
	- the `python/` version is currently tied up with Pangrammatron's code in `pangrammatron.py`
	- other languages could be added, assuming available data:
		- Pangrammatron needs to read a set of phones representing all distinct sounds in a language
		- Pangrammatron needs to read a map of words to phones representing all phones in all words in a language

## Source code

The current iteration of the project initializes an object that stores an alphabet, a phones dictionary and a phones inventory based on the passed-in language code (default `"en"`). It then expects a user to call one of its methods, passing it a sentence written in that alphabet to test for pangrams or a text sample containing words searchable in the phones dictionary to test for panphones. The phones dictionary does not check for consistency with the alphabet, so it could contain very different characters. In practice, the project uses an all caps English lexicon for phones, but a custom alphabet for graphemes.

### Interactions (Python Documentation)

#### Constructor

The `__init__` method is for building a Pangrammatron instance.

```Python
Pangrammatron (alphabet, language='en')
```
- Instantiate Pangrammatron with an alphabet and a language
	- `alphabet`: a string or list of discrete letters to store as an alphabetic set
	- Pangrammatron's loose definition of "alphabet" allows a variety of characters
	- `language`: a string representing the ISO 639-1 code of a language
	- Pangrammatron currently only offers support for English panphones

#### Response methods

The main methods allow Pangrammatron to evaluate passed-in data and yield the following results.

```Python
Pangrammatron.is_pangram (text)
```
- Ask if a sample of text is a pangram
- Returns:
	- `True` if every letter in the alphabet is in the sentence
	- `False` otherwise

```Python
Pangrammatron.how_pangrammatic (text)
```
- Ask how much of a pangram a sample of text is
- Returns:
	- the ratio of letters found to total letters in the alphabet

```Python
Pangrammatron.is_panphone (text)
```
- Ask if a sample of text is a panphone
- Returns:
	- `True` if every phone in phones dictionary is in the sentence
	- `False` otherwise

```Python
Pangrammatron.how_panphonic (text)
```
- Ask how much of a panphone a sample of text is
- Returns:
	- the ratio of phones found to total phones in the language's inventory

#### Get and Set methods

These methods are helpful for understanding or changing a Pangrammatron instance's references, particularly the stored data it uses to make calculations.

```Python
Pangrammatron.update_alphabet (alphabet)
```
- Change the alphabet that Pangrammatron uses to determine pangrams
	- `alphabet`: a string or list of discrete letters to store as an alphabetic set
	- Pangrammatron's loose definition of "alphabet" allows a variety of even nonalphabetic characters

```Python
Pangrammatron.update_language (language)
```
- Change the language that Pangrammatron uses to determine panphones
	- `language`: a string representing the ISO 639-1 code of a language

```Python
Pangrammatron.gather_phones (language)
```
- Gather a list of all phones in a language
	- `language`: a string representing the ISO 639-1 code of a language
	- Caution: does not just fetch data!
	- Caution: opens a raw text file and reads it line by line to parse phonemes

#### Calculator methods

These methods are used by Pangrammatron's response methods when parsing text data.

```Python
Pangrammatron.unique_letters (words)
```
- Find every unique letter in a list of words
	- `words` are expected to be passed in as a list (array)
	- letters must match those stored in Pangrammatron's current `alphabet`

```Python
Pangrammatron.unique_phones (words)
```
- Find every unique phone in a list of words
	- `words` are expected to be passed in as a list (array)
	- phones are transcribed then matched against those stored in Pangrammatron's current `alphabet`

#### Data

Pangrammatron stores internal data besides the `language` and `alphabet` fields, along with the passed-in `text` and `words`, all mentioned above. It contains a map relating language names to file paths for parsing a raw text list of phones and phones lexicon for each language. It also contains pangram and panphone memos for retrieving previous calculations.

### Limitations

For phonetic pangrams, currently the code can only check against English phonemes. Including text in another language, or even English words not found in the [phones dictionary](http://www.speech.cs.cmu.edu/cgi-bin/cmudict), will most likely make the `is_panphone()` or `how_panphonic()` results go awry.

For graphemic pangrams, this code does not make assumptions about the alphabetic nature of a writing system. You could pass it every [教育漢字](http://www.mext.go.jp/a_menu/shotou/new-cs/youryou/syo/koku/001.htm) Kyōiku Kanji, then test whether a (presumably very long) Japanese sentence is a pangram, or how close it is to pangram status.

## Contributing

This is a small tool I'm using to solve a quiz and then may tinker with from time to time, but let me know if you run into problems or brainstorm ways to improve it. Consider opening an issue or a pull request once you've tested it. Please do document reproducible steps for exceptions and fixes. Give as much relevant context as possible for enhancements.
