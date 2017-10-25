Feature: AfterAll hook
  These scenarios validate the AfterAll hook functionality


  Scenario: Helper AfterAll sanity
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
      helper.setHook('afterAll', function(){console.log('after all.');});
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: first.second.third.forth.after all.

  Scenario: Regular cucumber AfterAll sanity
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
      defineSupportCode(({AfterAll}) => {
        AfterAll(function(){console.log('after all.');});
      });
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: first.second.third.forth.after all.


  Scenario: Define AfterAll both in cucumber and in the helper
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
      helper.setHook('afterAll', function(){console.log('after all helper.'); return Promise.resolve();});

       let {defineSupportCode} = require('cucumber');
      defineSupportCode(({AfterAll}) => {
        AfterAll(function(){console.log('after all cucumber.');});
      });
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: first.second.third.forth.after all cucumber.after all helper.

