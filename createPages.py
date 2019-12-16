import os

def removePage(page_name, path, indent):
	consent = input(page_name + " will be removed, do you want to proceed? [Y] / [n]")
	if consent == "Y":
		#remove hbs
		try:
			os.remove(path+"/src/templates/"+page_name+".hbs")
			print("HBS file has been removed")
		except:
			print("HBS file not found, nothing removed")
		#remove js
		try:
			os.remove(path+"/src/pages/"+page_name+".js")
			print("JS file has been removed")
		except:
			print("Js file not found, nothing removed")

		#remove routes

		import_string = 'import '+page_name.capitalize()+' from \'./pages/'+page_name+'\';\n';
		object_string = indent + '{ path: \'/'+page_name+'\', view: '+page_name.capitalize()+' },\n';

		f = open(path+"/src/routes.js", 'r')
		lines = f.readlines()
		try:
			lines.remove(import_string)
			print("import string removed from routes")
		except:
			print("import_string wasn't found")

		try:
			lines.remove(object_string)
			print("object_string removed from routes")
		except:
			print("object_string wasn't found")

		f = open(path+"/src/routes.js", 'w')
		for line in lines:
			f.write(line)

		f.close();



def createPage(page_name, path, indent):
	#create hbs
	try:
		f = open(path+"/src/templates/"+page_name+".hbs","x")
		f = open(path+"/src/templates/"+page_name+".hbs","w+")
		f.write('{{> header }}')
		f.close();
	except:
		print("HBS file already exists! Updating other files")

	#create js

	try:
		f = open(path+"/src/pages/"+page_name+".js","x")
		f = open(path+"/src/pages/"+page_name+".js","w+")
		f.write('import App from \'../lib/App\';\n\nconst ' + page_name + 'Template = require(\'../templates/'+page_name+'.hbs\');\n\nexport default () => {\n' + indent + 'const title = \''+page_name+' automatic\';\n\n' + indent + 'App.render('+page_name+'Template({ title }));\n' + indent + 'App.router.navigate(\'/'+page_name+'\');\n};\n')
		f.close();
	except:
		print("JS file already exists! Updating other files")

	#add route

	f = open(path+"/src/routes.js", 'r')
	lines = f.readlines()
	insert_indexes = []
	for index in range(0, len(lines)):
		if lines[index] == '\n' and index != 0:
			insert_indexes.append(index)
			
		if lines[index] == '];\n':
			insert_indexes.append(index)
	import_string = 'import '+page_name.capitalize()+' from \'./pages/'+page_name+'\';\n';
	object_string = indent + '{ path: \'/'+page_name+'\', view: '+page_name.capitalize()+' },\n';

	if import_string in lines:
		if object_string in lines:
			print("Routes already up to date.")
		else:
			lines.insert(insert_indexes[1], object_string)
			print("Added object_string to routes")
	else:
		if object_string in lines:
			lines.insert(insert_indexes[0], import_string)
			print("Added import_string to routes")
		else:
			lines.insert(insert_indexes[0], import_string)
			lines.insert(insert_indexes[1], object_string)
			print("Added page to routes")		

	f = open(path+"/src/routes.js", 'w')
	for line in lines:
		f.write(line)

	f.close();

indent_choice = input("What's your indentation type? 4 spaces type [4], 2 spaces type [2], tab type [tab]")

indent = "\t"
if indent_choice == "4":
	indent = "    "
elif indent_choice == "2":
	indent = "  "
option = input("Would you like to ADD or REMOVE a page? [a]/[r]")
path = input("Path to your root app folder (ex: './mobdev/werkstuk) If you're currently in the root, press ENTER ")
if path == "":
	path = "."
if option == "A" or option == "a":
	input_string = input("type all pages you want to add seperated by spaces. MUST USE CAMELCASE ")
elif option == "R" or option == "r":
	input_string = input("type all pages you want to remove seperated by spaces. MUST USE CAMELCASE ")
else:
	print("OKE NIET DAN HE")
	exit()
pages = input_string.split(' ')
for page in pages:
	if option == "A" or option == "a":
		if "_" in page or " " in page:
			print(page + " is not a valid page name, don't use spaces or underscores")
		else:
			print(' /$$                                             /$$          \n| $$                                            |__/          \n| $$  /$$$$$$   /$$$$$$  /$$$$$$/$$$$   /$$$$$$  /$$  /$$$$$$ \n| $$ /$$__  $$ /$$__  $$| $$_  $$_  $$ /$$__  $$| $$ |____  $$\n| $$| $$  \ $$| $$$$$$$$| $$ \ $$ \ $$| $$  \ $$| $$  /$$$$$$$\n| $$| $$  | $$| $$_____/| $$ | $$ | $$| $$  | $$| $$ /$$__  $$\n| $$|  $$$$$$/|  $$$$$$$| $$ | $$ | $$| $$$$$$$/| $$|  $$$$$$$\n|__/ \______/  \_______/|__/ |__/ |__/| $$____/ |__/ \_______/\n                                      | $$                    \n                                      | $$                    \n                                      |__/ ')
			createPage(page, path, indent)
	elif option == "R" or option == "r":
		print(' /$$                                             /$$          \n| $$                                            |__/          \n| $$  /$$$$$$   /$$$$$$  /$$$$$$/$$$$   /$$$$$$  /$$  /$$$$$$ \n| $$ /$$__  $$ /$$__  $$| $$_  $$_  $$ /$$__  $$| $$ |____  $$\n| $$| $$  \ $$| $$$$$$$$| $$ \ $$ \ $$| $$  \ $$| $$  /$$$$$$$\n| $$| $$  | $$| $$_____/| $$ | $$ | $$| $$  | $$| $$ /$$__  $$\n| $$|  $$$$$$/|  $$$$$$$| $$ | $$ | $$| $$$$$$$/| $$|  $$$$$$$\n|__/ \______/  \_______/|__/ |__/ |__/| $$____/ |__/ \_______/\n                                      | $$                    \n                                      | $$                    \n                                      |__/ ')
		removePage(page, path, indent)
	