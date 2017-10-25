/* eslint-disable no-unused-vars */

/**
 * @typedef {object} UserFunctions
 * @property {function(function):function} stepFunctionWrapper
 * @property {function(TestCase[]):Array} testCasesManipulator
 * @property {HookUserFunctions} hooks
 */

/**
 * @typedef {object} HookUserFunctions
 * @property {function(Feature[]):Promise} beforeFeatures
 * @property {function():Promise} beforeAll
 * @property {function(TestCase):Promise<TestCase>} beforeScenario
 * @property {function():Promise} before
 * @property {function(Step, Array):Promise<Array>} beforeStep
 * @property {function(Step, object):Promise} afterStep
 * @property {function():Promise} after
 * @property {function():Promise} afterAll
 * @property {function(TestCase):Promise} afterScenario
 * @property {function(boolean):Promise<boolean>} afterFeatures
 */

let Promise = require('bluebird');

let getDefaultUserFunctions = function(){
    return {
        stepFunctionWrapper(fn){return fn;},
        testCasesManipulator(tCases){return tCases;},
        hooks : {
            beforeFeatures(features){return Promise.resolve(features);},
            beforeAll(){return Promise.resolve();},
            beforeScenario(scenario){return Promise.resolve();},
            before(){return Promise.resolve();},
            beforeStep(step, args){return Promise.resolve(args);},
            afterStep(step, result){if (result !== undefined && result.__helperError !== undefined) return Promise.reject(result.__helperError);},
            after(){return Promise.resolve();},
            afterAll(){return Promise.resolve();},
            afterScenario(scenario){return Promise.resolve();},
            afterFeatures(res){return Promise.resolve(res);}
        }
    };
};

/** @type {UserFunctions} */
module.exports = getDefaultUserFunctions();