Feature: AfterFeatures hook
  These scenarios validate the AfterFeature hook functionality

  Scenario: AfterFeatures sanity
    Given a file named "features/a.feature" with:
      """
      Feature:
        Scenario: first
          Then Log first

        Scenario: second
          Then Log second


      """
    And a file named "features/b.feature" with:
      """
      Feature:
        Scenario: third
          Then Log third

        Scenario: forth
          Then Log forth
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
    And a file named "features/support/hook.js" with:
      """
      let helper = require(process.env.helperPath + '/index.js');
      helper.setHook('afterFeatures', function(){console.log('Finished')});
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: first.second.third.forth.4 scenarios (4 passed)4 steps (4 passed)<duration-stat>Finished

  Scenario: AfterFeatures manipulate run result to pass
    Given a file named "features/a.feature" with:
      """
      Feature:
        Scenario: first
          Then Fail

      """
    And a file named "features/step_definitions/my_steps.js" with:
      """
      let {defineSupportCode} = require('cucumber');
      defineSupportCode(({Then}) => {
        Then(/^Fail$/i, function(message) {
          throw new Error('Fail');
        });
      });
      """
    And a file named "features/support/hook.js" with:
      """
      let helper = require(process.env.helperPath + '/index.js');
      helper.setHook('afterFeatures', function(res){
        return true;
      });
      """
    When I run cucumber
    Then It passes

  Scenario: AfterFeatures manipulate run result to fail
    Given a file named "features/a.feature" with:
      """
      Feature:
        Scenario: first
          Then Fail

      """

    And a file named "features/step_definitions/my_steps.js" with:
      """
      let {defineSupportCode} = require('cucumber');
      defineSupportCode(({Then}) => {
        Then(/^Fail$/i, function(message) {
          throw new Error('Fail');
        });
      });
      """
    And a file named "features/support/hook.js" with:
      """
      let helper = require(process.env.helperPath + '/index.js');

      helper.setHook('afterFeatures', function(res){
          return false;
        });
      """
    When I run cucumber
    Then It fails