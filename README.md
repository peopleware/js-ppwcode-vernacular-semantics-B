js-ppwcode-vernacular-semantics-private
=======================================

GETTING STARTED

This project is defined  with submodules.
To download the submodules, use the literal git commands:
> git submodule init
> git submodule update

This will download all needed submodules into lib/.





STRUCTURE

The main project files, with their associated tests, are located in

semantics/

semantics/_util and semantics/_exceptions contains coded needed for
the main code, that will presumably appear in a separate project in
a while.





TESTS

DOH
When the submodules are downloaded, the tests should work out of the
box when you navigate your browser to

semantics/test/runTests.html

INTERN
To get intern tests working:

Setup:
* install node on your system from <http://nodejs.org>
* execute in this directory:
> npm install intern --save-dev

This will install the necessary node modules in ./node-modules.

To run the tests:
* execute in this directory
> node node_modules/intern/client config=semantics/_test/_intern/all




DEMO

demo/ contains demonstration code for different features.
When the submodules are downloaded, this should work out of the box.

