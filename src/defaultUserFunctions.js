/* eslint-disable no-unused-vars */

/**
 * @typedef {object} UserFunctions
 * @property {function(function):function} stepFunctionWrapper
 * @property {function(TestCase[]):Array} testCasesManipulator
 * @property {HookUserFunctions} hooks
 */

/**
 * @typedef {object} HookUserFunctions
 * @property {function(HelperFeature[]):Promise} beforeFeatures
 * @property {function():Promise} beforeAll
 * @property {function(HelperFeature):Promise} beforeFeature
 * @property {function(HelperTestCase):Promise<HelperTestCase>} beforeScenario
 * @property {function():Promise} before
 * @property {function(HelperStep, Array):Promise<Array>} beforeStep
 * @property {function(HelperStep, HelperResult):Promise<HelperResult>} afterStep
 * @property {function():Promise} after
 * @property {function():Promise} afterAll
 * @property {function(HelperTestCase):Promise} afterScenario
 * @property {function(HelperFeature):Promise} afterFeature
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
            beforeFeature(feature){return Promise.resolve();},
            beforeScenario(scenario){return Promise.resolve();},
            before(){return Promise.resolve();},
            beforeStep(step, args){return Promise.resolve(args);},
            afterStep(step, result){return Promise.resolve(result);},
            after(){return Promise.resolve();},
            afterAll(){return Promise.resolve();},
            afterScenario(scenario){return Promise.resolve();},
            afterFeature(feature){return Promise.resolve();},
            afterFeatures(res){return Promise.resolve(res);}
        }
    };
};

/** @type {UserFunctions} */
module.exports = getDefaultUserFunctions();