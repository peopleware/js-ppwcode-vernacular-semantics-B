/*
Copyright 2012 - $Date $ by PeopleWare n.v.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

define(["ppwcode-util-contracts/doh", "../PropertyException"],
  function(doh, PropertyException) {

    var aKey = "SOME KEY";
    var aCause = "SOME CAUSE";

    var mockSender = {
      testProperty: 3
    };

    doh.register("ppwcode vernacular exceptions PropertyException", [

      function testConstructor1a() {
        var subject = new PropertyException({sender: mockSender});
        doh.invars(subject);
        doh.is(null, subject.key);
        doh.is(null, subject.cause);
        doh.is(null, subject.propertyName);
        doh.is(mockSender, subject.sender);
        doh.is(Object, subject.senderType);
      },

      function testConstructor1b() {
        var subject = new PropertyException({senderType: Object});
        doh.invars(subject);
        doh.is(null, subject.key);
        doh.is(null, subject.cause);
        doh.is(null, subject.propertyName);
        doh.is(null, subject.sender);
        doh.is(Object, subject.senderType);
      },

      function testConstructor2a() {
        var subject = new PropertyException({sender: mockSender, propertyName: "testProperty"});
        doh.invars(subject);
        doh.is(null, subject.key);
        doh.is(null, subject.cause);
        doh.is("testProperty", subject.propertyName);
        doh.is(mockSender, subject.sender);
        doh.is(Object, subject.senderType);
      },

      function testConstructor2b() {
        var subject = new PropertyException({senderType: Object, propertyName: "testProperty"});
        doh.invars(subject);
        doh.is(null, subject.key);
        doh.is(null, subject.cause);
        doh.is("testProperty", subject.propertyName);
        doh.is(null, subject.sender);
        doh.is(Object, subject.senderType);
      },

      function testConstructor3() {
        var subject = new PropertyException({sender: mockSender, propertyName: "testProperty", key: PropertyException.MANDATORY});
        doh.invars(subject);
        doh.is(PropertyException.MANDATORY, subject.key);
        doh.is(null, subject.cause);
        doh.is("testProperty", subject.propertyName);
        doh.is(mockSender, subject.sender);
        doh.is(Object, subject.senderType);
      }

    ]);

  }
);
