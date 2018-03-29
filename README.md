# Pangrammatron

Test if a sentence is a written or spoken pangram... and just how much of a pangram it is!

## What's a pangram?

When written sentence contains every letter of an alphabet, it's a **pangram**. For this project, I'm trying to identify two types of pangrams:
1. **graphemic pangram**: a sentence with at least one instance of every letter in a written language
2. **phonemic pangram**: a sentence with at least one instance of every phoneme used in a spoken language

I'll also refer to #2 with the term "panphone", since it focuses on all _phones_ (sounds).

## Why build this?

I'm going through some coursework on natural language processing. One of the quizzes just asked me to identify which in a list of sentences were phonetic versus graphemic pangrams. Rather than use intuition or laboriously compute them myself, I decided to build a project that will help solve the problem for me and maybe someone else down the road.

## Getting Started

You will be able to get it running simply by copying the files and executing the main script:
- make sure you have Python installed (developed with 3.6.4)
- download, fork or clone this repository
- navigate to the local project directory
- run the main `project.py` file with Python
	- try `python3 project.py` or `python project.py`

## Source code

The current iteration of the project initializes an object that stores an alphabet and a phones dictionary. It then expects a user to call one of its methods, passing it a sentence written in that alphabet.

### Interactions

The methods interact with the object and yield the following results:
- when asked if a sentence is a pangram
	- answer `True` if every letter in the alphabet is in the sentence
	- answer `False` otherwise
- when asked how much of a pangram a sentence is
	- answer with the ratio of letters found to total letters in the alphabet
- when asked if a sentence is a panphone
	- answer `True` if every phone in phones dictionary is in the sentence
	- answer `False` otherwise
- when asked how much of a panphone a sentence is
	- answer with the ratio of phones found to total phones in the language

### Limitations

For phonetic pangrams, currently the code can only check against English phonemes. Including text in another language, or even English words not found in the [phones dictionary](http://www.speech.cs.cmu.edu/cgi-bin/cmudict), will most likely make the results go awry.

For graphemic pangrams, this code does not make assumptions about the alphabetic nature of a writing system. You could pass it every 教育漢字 Kyōiku Kanji, then test whether a (presumably very long) Japanese sentence is a pangram, or how close it is to pangram status.

## Contributing

This is just a little tool I'm using to solve a quiz and then may tinker with from time to time, but let me know if you run into problems or brainstorm ways to improve it. Consider opening an issue or a pull request once you've tested it. Please do document reproducible steps for exceptions and fixes. Give as much relevant context as possible for enhancements.
