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

}

module.exports = Utils;