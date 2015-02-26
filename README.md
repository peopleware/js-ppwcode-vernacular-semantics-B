js-ppwcode-vernacular-semantics-private
=======================================

Getting started
---------------
This project is a library. Apart from the tests, there is nothing to run here.

To use the library:
* include it in your project
* add it as a package with the correct location to dojoConfig.packages



Dependencies
------------
The library depends on *dojo* (http://dojotoolkit.org) via the usual package name
`dojo`.



Structure
---------
The main project files are located in the root directory.

`_util` and `_exceptions` contains coded needed for
the main code, that will presumably appear in a separate project in
a while.

`_contract` contains contracts for the classes in the package.
`_test` contains the test case factories, and `_test/_intern`
contains the test setup for *intern* (http://theintern.io).



Demo
----
The accompanying demo application can be found on
<https://github.com/peopleware/js-ppwcode-enumeration-demo>.



Tests
-----
Tests are generated automatically for a given test framework.
Test setup is done assuming the dependent libraries are next to this library:
* `../dojo`

Setup is provided for *intern* (http://theintern.io).

### Intern

#### Setup:
* install node on your system from <http://nodejs.org>
* `cwd` should be 2 directories up (`../../`). Suppose the intermediate directory is called `<DIR>`.
* execute (in `../../`):

    >\> npm install intern --save-dev


This will install the necessary node modules in `../../node-modules`.

#### Browser Tests:
he Intern tests should work when you navigate your browser to
`_tests/_intern/runTest.html`.
Make sure to run the tests on a web server.


#### Run
The tests can also be run using NodeJS.

To run the tests, execute the following command in `../../`
directory: 

    > node node_modules/intern/client config=<DIR>/js-ppwcode-vernacular-semantics/_test/_intern/intern

