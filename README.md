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
`semantics/`

`semantics/_util` and `semantics/_exceptions` contains coded needed for
the main code, that will presumably appear in a separate project in
a while.





Tests
-----
### DOH
When the submodules are downloaded, the tests should work out of the
box when you navigate your browser to
`semantics/test/runTests.html`

### Intern
To get intern tests working:

#### Setup:
* install node on your system from <http://nodejs.org>
* execute in this directory:

    > npm install intern --save-dev

This will install the necessary node modules in `./node-modules`.

#### Run
To run the tests, execute in this directory:

    > node node_modules/intern/client config=semantics/_test/_intern/all




Demo
----
`demo/` contains demonstration code for different features.
When the submodules are downloaded, this should work out of the box.

