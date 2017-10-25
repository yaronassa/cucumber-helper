Feature: BeforeAll hook
  These scenarios validate the BeforeAll hook functionality


  Scenario: Helper BeforeAll sanity
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
      helper.setHook('beforeAll', function(){console.log('before all.'); return Promise.resolve();});
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: before all.first.second.third.forth

  Scenario: Regular cucumber BeforeAll sanity
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
      defineSupportCode(({BeforeAll}) => {
        BeforeAll(function(){console.log('before all.');});
      });
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: before all.first.second.third.forth


  Scenario: Define BeforeAll both in cucumber and in the helper
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
      helper.setHook('beforeAll', function(){console.log('before all helper.'); return Promise.resolve();});

       let {defineSupportCode} = require('cucumber');
      defineSupportCode(({BeforeAll}) => {
        BeforeAll(function(){console.log('before all cucumber.');});
      });
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: before all helper.before all cucumber.first.second.third.forth

