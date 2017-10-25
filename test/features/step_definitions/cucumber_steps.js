/**
 * @see https://github.com/cucumber/cucumber-js/blob/master/features/step_definitions/cli_steps.js
 */

let { defineSupportCode } = require('cucumber');
let stringArgv = require('string-argv');
let assert = require('assert');

defineSupportCode(function({ When, Then }) {
    /**
     * @this {World}
     */
    When(/^I run cucumber(?: with (.+))?$/i, { timeout: 10000 }, function(args) {
        let _self = this;
        args = stringArgv(args || '');
        return this.testRunner.run(args)
            .then(result => _self.lastResult = result);
    });

    Then(/^It passes$/i, function(){
        require('assert').equal(this.lastResult.result, true, `Test failed with ${this.lastResult.stdout || this.lastResult.stderr}`);
    });

    Then(/^It outputs the text:? *(.+)?$/i, function(inlineText){
        let actualText = this.normalizeText(this.lastResult.stdout);
        assert.ok(actualText.indexOf(inlineText) >= 0, `Expected "${inlineText}", actual was "${actualText}"`);
    });

    Then(/^It fails(?: with the error:? (.+))?$/i, function(error) {
        assert.equal(this.lastResult.result, false);

        if (error !== undefined) {
            let lowerError = error.toLowerCase();
            let errors = this.lastResult.jsonResult.reduce((accFeature, feature) => {
                return accFeature.concat(feature.elements.reduce((accScenario, scenario) => {
                    return accScenario.concat(scenario.steps.reduce((accStep, step) => {
                        if (step.result.error_message !== undefined) accStep.push(step.result.error_message.toLowerCase());
                        return accStep;
                    }, []));
                }, []));
            }, []);

            assert.ok(errors.some(err => err.indexOf(lowerError) >= 0));
        }

    });

});