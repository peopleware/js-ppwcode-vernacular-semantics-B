js-ppwcode-vernacular-semantics-private
=======================================

Getting started
---------------
This project is defined  with submodules.
To download the submodules, use the literal git commands:

    > git submodule init
    > git submodule update

This will download all needed submodules into `lib/`.





Structure
---------
The main project files, with their associated tests, are located in
the root directory.

`_util` and `_exceptions` contains coded needed for
the main code, that will presumably appear in a separate project in
a while.





Tests
-----
### DOH
When the submodules are downloaded, the DOH tests should work out 
of the box when you navigate your browser to
`_tests/_doh/runTest.html`.
Make sure to run the tests on a web server.

### Intern
When the submodules are downloaded, the Intern tests should work out 
of the box when you navigate your browser to
`_tests/_intern/runTest.html`.
Make sure to run the tests on a web server.

The tests can also be run using NodeJS.

#### Setup:
* install node on your system from <http://nodejs.org>
* execute in this directory:

    >\> npm install intern --save-dev


This will install the necessary node modules in `./node-modules`.

#### Run
To run the tests, execute the following command in the root 
directory: 

    > node node_modules/intern/client config=_test/_intern/intern




Demo
----
The accompanying demo application can be found on
<https://github.com/peopleware/js-ppwcode-enumeration-demo>.

