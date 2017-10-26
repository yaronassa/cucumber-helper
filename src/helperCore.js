let Promise = require('bluebird');

/** @type {HelperCore} */
// eslint-disable-next-line consistent-this
let singleton = undefined;

/**
 * Core functionality of the cucumber helper
 */
class HelperCore {
    /**
     * Initializes the class
     * @param {Helper} helper
     */
    constructor(helper){

        singleton = this;
        /** @type {Helper} */
        this.helper = helper;

        /** @type {Replacer} */
        this.replacer = new (require('./replacer'))(this);

        /** @type {Utils} */
        this.utils = new (require('./utils'))(this);

        /** @type {UserFunctions}  */
        this.userFunctions = require('./defaultUserFunctions');

        /**
         * The current run state
         * @type {HelperRunState}
         */
        this.currentRun = {
            testCases : [],
            features : [],
            currentFeature: undefined,
            currentTestCase : undefined,
            currentStep : undefined
        };

        this._currentStepIndex = 0;
        this._currentTCaseStart = undefined;
        this._currentFeatureStart = undefined;

        this._registeredStepWrappers = false;
    }

    /**
     * Sets the current test case
     * @param {HelperTestCase} tCase
     */
    setCurrentTestCase(tCase){
        singleton.currentRun.currentTestCase = tCase;
        singleton._currentTCaseStart = new Date();
        singleton._currentStepIndex = -1;
    }

    /**
     * Processes a test case after it ended
     * @param {HelperTestCase} tCase The test case to process
     * @returns {Promise}
     */
    endTestCase(tCase){
        tCase.duration = new Date() - singleton._currentTCaseStart;
        return singleton.runHook('afterScenario', [tCase])
            .then(() => singleton.runAfterFeatureIfNeeded());
    }

    /**
     * Promotes the current feature (if needed)
     * @param {HelperTestCase} newTestCase The upcoming testCase
     * @returns {Promise}
     */
    promoteFeatureIfNeeded(newTestCase){
        if (singleton.currentRun.currentTestCase !== undefined && singleton.currentRun.currentTestCase.feature.sameAs(newTestCase.feature)) return Promise.resolve();
        singleton.currentRun.currentFeature = newTestCase.feature;
        singleton._currentFeatureStart = new Date();
        return singleton.runHook('beforeFeature', [newTestCase.feature]);
    }

    /**
     * Runs the AfterFeature hook, if needed
     * @returns {Promise}
     */
    runAfterFeatureIfNeeded(){
        if (singleton.currentRun.currentFeature === undefined) return Promise.resolve();

        if (singleton.currentRun.currentTestCase.featureIndex === singleton.currentRun.currentFeature.testCases.length -1) {
            singleton.currentRun.currentFeature.duration = new Date() - singleton._currentFeatureStart;
            return singleton.runHook('afterFeature', [singleton.currentRun.currentFeature]);
        } else {
            return Promise.resolve();
        }

    }

    /**
     * Promotes the current run step pointer
     * @private
     */
    _promoteCurrentStep(){
        singleton._currentStepIndex = singleton._currentStepIndex + 1;
        singleton.currentRun.currentStep = (singleton.currentRun.currentTestCase) ? singleton.currentRun.currentTestCase.pickle.steps[singleton._currentStepIndex] : undefined;
    }

    /**
     * Register pre-post step wrappers
     * @param {function} registrationFunction The original setDefinitionFunctionWrapper function
     */
    registerStepWrappers(registrationFunction){
        if (singleton._registeredStepWrappers === true) return;
        registrationFunction(singleton._definitionFunctionWrapper);
        singleton._registeredStepWrappers = true;
    }

    /**
     * Master step in-out manipulator
     * @param {function} stepFunction
     * @private
     */
    _definitionFunctionWrapper(stepFunction){
        return function stepWithHooks(){
            let _self = this;
            let initialArgs = arguments;
            let finalResult;

            singleton._promoteCurrentStep();

            let currentStep = singleton.currentRun.currentStep || {};
            let stepStart = new Date();

            return singleton.runHook('beforeStep', [currentStep, Array.from(initialArgs)])
                .then(function(processedArgs){
                    let actualArgs = (processedArgs === undefined) ? initialArgs : processedArgs;

                    return singleton._runUnknownFunction(stepFunction, _self, actualArgs)
                        .then(result => ({result: true, original_result: result}))
                        .catch(e => Promise.resolve({result: false, error_message: e.message}));
                }).then(helperResult => {
                    currentStep.duration = new Date() - stepStart;
                    return singleton.runHook('afterStep', [currentStep, helperResult])
                        .then(hookResult => {
                            finalResult = (hookResult && hookResult.result !== undefined) ? hookResult : helperResult;
                            if (finalResult.result === false) {
                                let error = new Error(finalResult.error_message || helperResult.error_message || 'Unspecified error');
                                throw error;
                            }
                            return finalResult;
                        });
                }).finally(() => {
                    if (singleton.currentRun.currentStep) singleton.currentRun.currentStep.result = finalResult;
                    if (singleton.currentRun.currentTestCase) singleton.currentRun.currentTestCase.result = finalResult;
                    if (singleton.currentRun.currentFeature) singleton.currentRun.currentFeature.result = finalResult;
                });
        };

    }

    /**
     * Runs a function that's either sync or promise based
     * @param {function} fn The function
     * @param {object} thisArg This args to send to the function
     * @param {Array} args argument array
     * @returns {Promise}
     * @private
     */
    _runUnknownFunction(fn, thisArg, args){
        return Promise.try(function(){

            let result = fn.call(thisArg, ...args);
            if (result && result.then && typeof result.then === 'function') return new Promise((resolve, reject) => result.then(resolve).catch(reject));

            return result;
        });
    }

    /**
     * Safely runs a hook, returning a promise
     * @param {string} hookName The hook to run
     * @param {Array} [args=Array] Optional args
     * @returns {Promise}
     */
    runHook(hookName, args=[]){
        return Promise.try(function(){
            let target = singleton.userFunctions.hooks[hookName];
            if (target === undefined) throw new Error(`Cannot find hook ${hookName}`);

            return singleton._runUnknownFunction(target, singleton, args);
        });
    }

    /**
     * Manipulates the original cucumber testCases and performs user manipulations on them
     * @param {cucumber.Runtime} runtime The cucumber Runtime instance
     * @returns {HelperTestCase[]} The manipulated test cases
     */
    registerAndManipulateTestCase(runtime){
        let originalTestCases = runtime.testCases;
        singleton.currentRun.testCases = singleton.userFunctions.testCasesManipulator(originalTestCases);
        if (!Array.isArray(singleton.currentRun.testCases)) throw new Error('User\'s testCases manipulator did not return an Array');
        singleton.currentRun.testCases.forEach(tCase => tCase.pickle.steps.forEach(step => step.testCase = tCase));

        singleton.currentRun.features = singleton.utils.testCasesToFeatures(singleton.currentRun.testCases);

        Object.defineProperty(runtime, 'testCases', {get(){return singleton.helper.currentRun.testCases;}});
        return singleton.currentRun.testCases;
    }


    /**
     * Sets the user hook function
     * @param {string} hookName
     * @param {function} userFunction The hook function
     */
    setHook(hookName, userFunction){
        switch (hookName.toLowerCase()) {
            case 'beforefeatures':
                singleton.userFunctions.hooks.beforeFeatures = userFunction;
                break;
            case 'beforeall':
                singleton.userFunctions.hooks.beforeAll = userFunction;
                singleton.replacer.originalMethods.mainObject.defineSupportCode(function({BeforeAll}){
                    BeforeAll(userFunction);
                });
                break;
            case 'beforefeature':
                singleton.userFunctions.hooks.beforeFeature = userFunction;
                break;
            case 'beforescenario':
                singleton.userFunctions.hooks.beforeScenario = userFunction;
                break;
            case 'before':
                singleton.userFunctions.hooks.before = userFunction;
                singleton.replacer.originalMethods.mainObject.defineSupportCode(function({Before}){
                    Before(userFunction);
                });
                break;
            case 'beforestep':
                singleton.userFunctions.hooks.beforeStep = userFunction;
                break;
            case 'stepresult':
                throw new Error('StepResult hook was replaced by AfterStep');
            case 'afterstep':
                singleton.userFunctions.hooks.afterStep = userFunction;
                break;
            case 'after':
                singleton.userFunctions.hooks.after = userFunction;
                singleton.replacer.originalMethods.mainObject.defineSupportCode(function({After}){
                    After(userFunction);
                });
                break;
            case 'scenarioresult':
                throw new Error('ScenarioResult hook was replaced by AfterScenario');
            case 'afterscenario':
                singleton.userFunctions.hooks.afterScenario = userFunction;
                break;
            case 'featureresult':
                throw new Error('FeatureResult hook was replaced by AfterFeature');
            case 'afterfeature':
                singleton.userFunctions.hooks.afterFeature = userFunction;
                break;
            case 'afterall':
                singleton.userFunctions.hooks.afterAll = userFunction;
                singleton.replacer.originalMethods.mainObject.defineSupportCode(function({AfterAll}){
                    AfterAll(userFunction);
                });
                break;
            case 'afterfeatures':
                singleton.userFunctions.hooks.afterFeatures = userFunction;
                break;
            default:
                throw new Error(`Unknown hook ${hookName}`);
        }
    }
}

module.exports = HelperCore;