Feature: Basic fail/pass sanity
  These scenarios make sure the helper didn't interfere with cucumber's basic run result propagation

  Scenario: Passed Run
    Given a file named "features/a.feature" with:
      """
      Feature:
        Scenario:
          Then the value is 0

      """
    And a file named "features/step_definitions/world.js" with:
      """
      let {defineSupportCode} = require('cucumber');
      defineSupportCode(({setWorldConstructor}) => {
        setWorldConstructor(function() {
          this.value = 0
        })
      })
      """
    And a file named "features/step_definitions/my_steps.js" with:
      """
      let assert = require('assert');
      let {defineSupportCode} = require('cucumber');
      defineSupportCode(({Then}) => {
        Then(/^the value is (\d*)$/, function(number) {
          assert.equal(number, this.value)
        })
      })
      """
    When I run cucumber
    Then It passes

  Scenario: Failed run
    Given a file named "features/a.feature" with:
      """
      Feature:
        Scenario:
          Then the value is 0

      """
    And a file named "features/step_definitions/world.js" with:
      """
      let {defineSupportCode} = require('cucumber');
      defineSupportCode(({setWorldConstructor}) => {
        setWorldConstructor(function() {
          this.value = 1
        })
      })
      """
    And a file named "features/step_definitions/my_steps.js" with:
      """
      let assert = require('assert');
      let {defineSupportCode} = require('cucumber');
      defineSupportCode(({Then}) => {
        Then(/^the value is (\d*)$/, function(number) {
          assert.equal(number, this.value)
        })
      })
      """
    When I run cucumber
    Then It fails with the error: '0' == 1