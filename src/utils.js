/** @type {Utils} */
// eslint-disable-next-line no-unused-vars,consistent-this
let singleton = undefined;


/**
 * Misc utils, converters and helpers
 */
class Utils {
    /**
     * Initializes the class
     */
    constructor(helperCore){
        singleton = this;
        /** @type {Helper} */
        this.helper = helperCore.helper;
        /** @type {HelperCore} */
        this.helperCore = helperCore;
    }

    /**
     * Transforms an array of test cases to feature-grouped objects
     * @param {TestCase[]} tCases
     * @returns {Feature[]} The reversed engineered feature objects
     */
    testCasesToFeatures(tCases){
        let features = tCases.reduce((acc, tCase) => {
            if (acc[tCase.uri] === undefined) acc[tCase.uri] = {scenarios: [], uri: tCase.uri, fileName: tCase.uri.substr(tCase.uri.lastIndexOf('/')+1)};
            acc[tCase.uri].scenarios.push(tCase);
            return acc;
        }, {});

        return features;
    }

    /**
     * Gets a consecutive feature from this test case onward
     * @param {TestCase[]} tCases The test cases to run through
     * @param {TestCase} startingTestCase The starting test case
     * @returns {Feature} The reconstructed test case
     */
    getFeatureFromStartingTCase(tCases, startingTestCase){
        let startIndex = tCases.findIndex(tCase => (tCase.uri === startingTestCase.uri && tCase.pickle.locations[0].line === startingTestCase.pickle.locations[0].line));
        let matchingCases = tCases.slice(startIndex);
        let endIndex = matchingCases.findIndex(tCase => tCase.uri !== startingTestCase.uri);
        if (endIndex >= 0) matchingCases = matchingCases.slice(0, endIndex);

        return singleton.testCasesToFeatures(matchingCases)[startingTestCase.uri];
    }

}

module.exports = Utils;