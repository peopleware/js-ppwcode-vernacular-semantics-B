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

define(["../_util/contracts/doh", "./TransformerMethodTests", "../_util/contracts/createTests",
   "./ppwCodeObjectTestGenerator"],
  function(doh, TransformerMethodTests, createTests, ppwCodeObjectTestGenerator) {

    var constructorTests = new TransformerMethodTests();

    var formatOptionsFactories = {
      name: "options",
      factories: [
        null,
        undefined,
        function() {return {locale: "nl"};},
        {
          name: "options.locale === ru --> fallback language",
          factory: function() {return {locale: "ru"};}
        }
      ]
    };

    return function(methodTests, /*Function[]*/ subjectFactories) {

      var createSubject = subjectFactories[0];
      var createSubjectSameTypeOtherDataLarger = subjectFactories[1];
      var createSubjectOtherTypeSameDataNoMid = subjectFactories[2];

      var ValueType = createSubject().constructor;

      ppwCodeObjectTestGenerator(methodTests, subjectFactories);
      doh.register(methodTests.Type.prototype.getTypeDescription(), [
        {
          name: "has a format",
          runTest: function() {
            doh.is("function", typeof ValueType.format);
          }
        },
        {
          name: "has a parse",
          runTest: function() {
            doh.is("function", typeof ValueType.parse);
          }
        }
      ]);
      createTests(
        constructorTests,
        "format",
        [
          [function() {return ValueType;}], // subject factories
          {name: "value", factories: [null, undefined, createSubject]},
          formatOptionsFactories
        ]
      );
      createTests(
        constructorTests,
        "parse",
        [
          [function() {return ValueType;}], // subject factories
          {name: "value", factories: [
            null,
            undefined,
            "",
            {
              name: "a value",
              factory: function() {return ValueType.format(createSubject());}
            },
            {
              name: "not a value",
              factory: "XX not a formatted value XX"
            }
          ]},
          formatOptionsFactories
        ]
      );
      createTests(
        methodTests,
        "compare",
        [
          [createSubject], // subject factories
          {name: "other", factories: [
            "$this",
            "$this()",
            {
              name: "large",
              factory: createSubjectSameTypeOtherDataLarger
            }
          ]}
        ]
      );
      createTests(
        methodTests,
        "equals",
        [
          [createSubject], // subject factories
          {name: "other", factories: [
            null,
            undefined,
            "$this",
            "$this()",
            {
              name: "unequal object of same type",
              factory: createSubjectSameTypeOtherDataLarger
            },
            {
              name: "object of other type",
              factory: createSubjectOtherTypeSameDataNoMid
            },
            {
              name: "not-a-value Number",
              factory: 4
            },
            {
              name: "not-a-value String",
              factory: "TEST"
            },
            {
              name: "not-a-value Date",
              factory: function() {return new Date();}
            },
            {
              name: "not-a-value Function",
              factory: function() {return window.open;}
            },
            {
              name: "not-a-value object",
              factory: function() {return window;}
            }
          ]}
        ]
      );
      createTests(
        methodTests,
        "coerceTo",
        [
          [createSubject], // subject factories
          {name: "Type", factories: [
            null,
            undefined,
            {
              name: "same type",
              factory: function() {return ValueType;}
            }
            //            {
            //              name: "coerceTo other type, supported, expect success",
            //              runTest: function () {
            //                var subject = createSubjectOtherTypeSameDataNoMid();
            //                var supportedOtherType = createSubject().constructor;
            //                instanceTests.coerceToData(subject, supportedOtherType, subject.data);
            //              }
            //            },
            //            {
            //              name: "coerceTo other type, not supported, expect fail",
            //              runTest: function () {
            //                var subject = getTestSubject();
            //                instanceTests.coerceTo(subject, ValueStub2, undefined);
            //              }
            //            },
            //            {
            //              name: "coerceTo other type (chaining), supported, expect succes",
            //              runTest: function () {
            //                var subject = getTestSubjectChainingType();
            //                instanceTests.coerceToData(subject, ValueStub1, subject.data);
            //              }
            //            },
            //            {
            //              name: "coerceTo other type (chaining), not supported, expect failure",
            //              runTest: function () {
            //                var subject = getTestSubjectOtherTypeSameData();
            //                instanceTests.coerceTo(subject, ValueStub3, undefined);
            //              }
            //            },
          ]}
        ]
      );
      createTests(
        methodTests,
        "format",
        [
          [createSubject], // subject factories
          formatOptionsFactories
        ]
      );
    };

  }
);
