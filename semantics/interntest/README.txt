1. INSTALL node.js FROM: http://nodejs.org/download/
2. 	cd /my/project/root
	// our case is:\js-ppwcode-vernacular-semantics-private\semantics
	npm install intern --save-dev
3. 	mkdir interntest
	cp node_modules/intern/tests/example.intern.js interntest/intern.js
	
4.	node node_modules/intern/client.js config=interntest/intern.js