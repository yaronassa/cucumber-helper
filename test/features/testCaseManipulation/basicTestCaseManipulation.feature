Feature: Test case manipulations
  These scenarios validate the helper's ability to manipulate the test case stack before the run
@debug
  Scenario: Basic same-feature order manipulation
    Given a file named "features/a.feature" with:
      """
      Feature:
        Scenario: first
          Then Log first

        Scenario: second
          Then Log second


      """
    And a file named "features/step_definitions/my_steps.js" with:
      """
      let {defineSupportCode} = require('cucumber');
      defineSupportCode(({Then}) => {
        Then(/^Log (.+)$/i, function(message) {
          console.log(message);
        });
      });
      """
    And a file named "features/support/manipulator.js" with:
      """
      let helper = require(process.env.helperPath + '/index.js');
      helper.setTestCaseManipulator(function(tCases){return tCases.reverse();});
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: second.first.


  Scenario: Basic same-feature case deletion manipulation
    Given a file named "features/a.feature" with:
      """
      Feature:
        Scenario: first
          Then Log first

        Scenario: second
          Then Log second


      """
    And a file named "features/step_definitions/my_steps.js" with:
      """
      let {defineSupportCode} = require('cucumber');
      defineSupportCode(({Then}) => {
        Then(/^Log (.+)$/i, function(message) {
          console.log(message);
        });
      });
      """
    And a file named "features/support/manipulator.js" with:
      """
      let helper = require(process.env.helperPath + '/index.js');
      helper.setTestCaseManipulator(function(tCases){return tCases.slice(1);});
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: second.1 scenario

