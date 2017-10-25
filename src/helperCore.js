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
         * @type {{testCases: TestCase[], currentTestCase: TestCase, currentStep: Step}}
         */
        this.currentRun = {
            testCases : [],
            currentTestCase : undefined,
            currentStep : undefined
        };
        this._currentStepIndex = 0;

        this._registeredStepWrappers = false;
    }

    /**
     * Sets the current test case
     * @param {TestCase} tCase
     */
    setCurrentTestCase(tCase){
        singleton.currentRun.currentTestCase = tCase;
        singleton._currentStepIndex = -1;
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

            singleton._promoteCurrentStep();

            let currentStep = require('clone-deep')(singleton.currentRun.currentStep); //We're already in the step, changing the object will do nothing

            return singleton.runHook('beforeStep', [currentStep, Array.from(initialArgs)])
                .then(function(processedArgs){
                    let actualArgs = (processedArgs === undefined) ? initialArgs : processedArgs;

                    return singleton._runUnknownFunction(stepFunction, _self, actualArgs)
                        .catch(e => Promise.resolve({__helperError: e}));

                }).then(result => {
                    return singleton.runHook('afterStep', [currentStep, result])
                        .then(hookResult => {
                            if (hookResult === undefined && result !== undefined && result.__helperError !== undefined) throw result.__helperError;
                            return result;
                        });
                }).tapCatch(e => singleton.currentRun.currentTestCase.result = {result: 'failed', error_message: e.message});
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
     * @returns {TestCase[]} The manipulated test cases
     */
    registerAndManipulateTestCase(runtime){
        let originalTestCases = runtime.testCases;
        singleton.currentRun.testCases = singleton.userFunctions.testCasesManipulator(originalTestCases);
        if (!Array.isArray(singleton.currentRun.testCases)) throw new Error('User\'s testCases manipulator did not return an Array');

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
            case 'afterstep':
                singleton.userFunctions.hooks.afterStep = userFunction;
                break;
            case 'after':
                singleton.userFunctions.hooks.after = userFunction;
                singleton.replacer.originalMethods.mainObject.defineSupportCode(function({After}){
                    After(userFunction);
                });
                break;
            case 'afterscenario':
                singleton.userFunctions.hooks.afterScenario = userFunction;
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