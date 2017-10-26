Feature: AfterFeature hook
  These scenarios validate the AfterFeature hook functionality
@debug
  Scenario: AfterScenario sanity
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
      helper.setHook('afterFeature', function(feature){console.log(feature.fileName + '.');});
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: first.second.a.feature.third.forth.b.feature.
