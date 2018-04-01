from pangrammatron import Pangrammatron

def run_text_ui(pan):
	"""Wrap Pangrammatron interactions for raw input"""
	try:
		txt = input("\nType a sentence to check (or q to quit):\n")
	except KeyboardInterrupt:
		print("\nExiting")
		return None
	if (txt.upper() in ["Q", "^C", "", "\n", "QUIT"]):
		print("Thank you for using Pangrammatron! Goodbye.\n")
		return None
	print("\nYour example %s a pangram." % ("is" if pan.is_pangram(txt) else "is not"))
	print("It contains %s%% of the letters in the alphabet." % round(pan.how_pangrammatic(txt)*100))
	print("\nYour example %s a panphone." % ("is" if pan.is_panphone(txt) else "is not"))
	print("It contains %s%% of the phones in the inventory." % round(pan.how_panphonic(txt)*100))
	run_text_ui(pan)

if __name__ == '__main__':
	pan = Pangrammatron("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
	run_text_ui(pan)
