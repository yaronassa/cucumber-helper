Feature: BeforeScenario hook
  These scenarios validate the beforeScenario hook functionality



  Scenario: BeforeScenario sanity
    Given a file named "features/a.feature" with:
      """
      Feature:
        Scenario: first scenario
          Then Log first

        Scenario: second scenario
          Then Log second


      """
    And a file named "features/b.feature" with:
      """
      Feature:
        Scenario: third scenario
          Then Log third

        Scenario: forth scenario
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
      helper.setHook('beforeScenario', function(scenario){
        console.log(scenario.pickle.name + '.');
        return Promise.resolve();
       });
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: first scenario.first.second scenario.second.third scenario.third.forth scenario.forth


  Scenario: BeforeScenario manipulate test case
    Given a file named "features/a.feature" with:
      """
      Feature:
        Scenario: first scenario
          Then Log first
          Then Log second

      """
    And a file named "features/b.feature" with:
      """
      Feature:
        Scenario: third scenario
          Then Log third
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
      helper.setHook('beforeScenario', function(scenario){
        scenario.pickle.steps.splice(0,1);
        return Promise.resolve();
       });
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: 2 steps (2 passed)
