Feature: AfterStep hook
  These scenarios validate the AfterStep hook functionality

  Scenario: AfterStep sanity
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
      helper.setHook('afterStep', function(){
        console.log('.after');
      });
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: first.after.second.after.third.after.forth.after

  Scenario: AfterStep error swallow
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
        Then(/^Fail/i, function() {
          throw new Error('Failed');
        });
      });
      """
    And a file named "features/support/hook.js" with:
      """
      let helper = require(process.env.helperPath + '/index.js');
      helper.setHook('afterStep', function(step, result){
        return {result: true}
      });
      """
    When I run cucumber
    Then It passes

  Scenario: AfterStep error manipulation
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
        Then(/^Fail/i, function() {
          throw new Error('Failed');
        });
      });
      """
    And a file named "features/support/hook.js" with:
      """
      let helper = require(process.env.helperPath + '/index.js');
      helper.setHook('afterStep', function(){
        return {result: false, error_message: 'Changed Error'};
      });
      """
    When I run cucumber
    Then It fails with the error: Changed Error

  Scenario: BeforeStep can affect AfterStep
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
        Then(/^Fail/i, function() {
          throw new Error('Failed');
        });
      });
      """
    And a file named "features/support/hook.js" with:
      """
      let helper = require(process.env.helperPath + '/index.js');
      helper.setHook('beforeStep', function(step){
        step._myMessage = 'Something';
      });
      helper.setHook('afterStep', function(step, result){
        return {result: false, error_message: step._myMessage};
      });
      """
    When I run cucumber
    Then It fails with the error: Something

