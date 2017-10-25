Feature: After hook
  These scenarios validate the After hook functionality

  Scenario: Helper After sanity
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
      helper.setHook('after', function(){console.log('after');});
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: first.after.second.after.third.after.forth.after

  Scenario: Regular cucumber After sanity
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
      let {defineSupportCode} = require('cucumber');
      defineSupportCode(({After}) => {
        After(function(){console.log('after');});
      });
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: first.after.second.after.third.after.forth.after


  Scenario: Define After both in cucumber and in the helper
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
      helper.setHook('after', function(){console.log('after helper'); return Promise.resolve();});

       let {defineSupportCode} = require('cucumber');
      defineSupportCode(({After}) => {
        After(function(){console.log('after cucumber');});
      });
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: first.after cucumber.after helper.second.after cucumber.after helper.third.after cucumber.after helper.forth.after cucumber.after helper.
