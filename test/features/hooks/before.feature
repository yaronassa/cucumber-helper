Feature: Before hook
  These scenarios validate the Before hook functionality

  Scenario: Helper Before sanity
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
      helper.setHook('before', function(){console.log('before'); return Promise.resolve();});
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: before.first.before.second.before.third.before.forth

  Scenario: Regular cucumber Before sanity
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
      defineSupportCode(({Before}) => {
        Before(function(){console.log('before');});
      });
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: before.first.before.second.before.third.before.forth


  Scenario: Define Before both in cucumber and in the helper
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
      helper.setHook('before', function(){console.log('before helper'); return Promise.resolve();});

       let {defineSupportCode} = require('cucumber');
      defineSupportCode(({Before}) => {
        Before(function(){console.log('before cucumber');});
      });
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: before helper.before cucumber.first.before helper.before cucumber.second.before helper.before cucumber.third.before helper.before cucumber.forth
