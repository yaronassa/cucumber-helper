/** @type {Replacer} */
// eslint-disable-next-line consistent-this
let singleton = undefined;

/**
 * Manages original cucumber function replacement
 */
class Replacer {
    /**
     * Initializes the class
     * @param {HelperCore} helperCore
     */
    constructor(helperCore){

        singleton = this;
        /** @type {Helper} */
        this.helper = helperCore.helper;
        /** @type {HelperCore} */
        this.helperCore = helperCore;

        this._initReplacer();
    }

    /**
     * Initializes the replacer and perform built-in function replacements
     * @private
     */
    _initReplacer() {
        this.originalMethods = {
            mainObject: {
                defineSupportCode: singleton.helper.cucumber.defineSupportCode
            },
            Runtime: {
                start: singleton.helper.cucumber.Runtime.prototype.start,
                runTestRunHooks : singleton.helper.cucumber.Runtime.prototype.runTestRunHooks,
                runTestCase: singleton.helper.cucumber.Runtime.prototype.runTestCase
            },
            Cli: {
                run: singleton.helper.cucumber.Cli.prototype.run
            }
        };

        singleton.helper.cucumber.Cli.prototype.run = this._Cli_run;
        singleton.helper.cucumber.Runtime.prototype.start = this._Runtime_start;
        singleton.helper.cucumber.Runtime.prototype.runTestCase = this._Runtime_runTestCase;
        singleton.helper.cucumber.defineSupportCode = this._mainObject_defineSupportCode;
    }


    /**
     * Replacer for cucumber.Cli.run
     * This replacement facilitates beforeFeatures and afterFeatures hook
     * @private
     */
    _Cli_run(){
        let _self = this;
        let runResult;

        return singleton.originalMethods.Cli.run.call(_self, ...arguments)
            .then(res => {
                runResult = res;
                return singleton.helperCore.runHook('afterFeatures', [res]);
            }).then(res => (res === undefined) ? runResult : res);
    }

    /**
     * Replacer for cucumber.Runtime.start
     * This replacement facilitates test case order manipulations
     * @this {cucumber.Runtime}
     * @returns {Promise}
     * @private
     */
    _Runtime_start(){
        /** @type {cucumber.Runtime} */ // eslint-disable-next-line consistent-this
        let runtime = this;

        return singleton.helperCore.runHook('beforeFeatures', [singleton.helperCore.utils.testCasesToFeatures(runtime.testCases)])
            .then(function(){
                singleton.helperCore.registerAndManipulateTestCase(runtime);
                return singleton.originalMethods.Runtime.start.call(runtime, ...arguments);
            });
    }

    /**
     * Replacer for cucumber.Runtime.runTestCase
     * This replacement facilitates the beforeScenario hook
     * @param {TestCase} tCase The cucumber pickle test case
     * @this {cucumber.Runtime}
     * @returns {Promise}
     * @private
     */
    _Runtime_runTestCase(tCase){
        /** @type {cucumber.Runtime} */ // eslint-disable-next-line consistent-this
        let runtime = this;
        return singleton.helperCore.promoteFeatureIfNeeded(tCase)
            .then(function(){
                singleton.helperCore.setCurrentTestCase(tCase);
                return singleton.helperCore.runHook('beforeScenario', [tCase])
                    .then(() => singleton.originalMethods.Runtime.runTestCase.call(runtime, tCase))
                    .then(() => singleton.helperCore.runHook('afterScenario', [tCase]))
                    .then(() => singleton.helperCore.runAfterFeatureIfNeeded());
            });
    }

    /**
     * Replacer for cucumber.defineSupportCode
     * This replacement facilitates step in-out manipulations, as it allows us to use our own setDefinitionFunctionWrapper
     * @param {function} userFunction
     * @private
     */
    _mainObject_defineSupportCode(userFunction){
        singleton.originalMethods.mainObject.defineSupportCode(function(originalResponse){
            singleton.helperCore.registerStepWrappers(originalResponse.setDefinitionFunctionWrapper);
            originalResponse.setDefinitionFunctionWrapper = function(fn){
                singleton.helperCore.userFunctions.stepFunctionWrapper = fn;
            };

            return userFunction(originalResponse);
        });
    }

}

module.exports = Replacer;