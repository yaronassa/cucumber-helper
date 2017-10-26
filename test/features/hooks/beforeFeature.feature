Feature: BeforeFeature hook
  These scenarios validate the beforeFeature hook functionality

  #TODO: test beforeFeature after scenario reordering

  Scenario: BeforeFeature sanity
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
      helper.setHook('beforeFeature', function(feature){console.log('before ' + feature.fileName + '.');});
      """
    When I run cucumber
    Then It passes
    Then It outputs the text: before a.feature.first.second.before b.feature.third.forth.