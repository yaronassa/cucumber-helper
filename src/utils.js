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
     * Reverse engineers a feature skeleton
     * @param {string} uri The feature's URI
     * @param {number} [uriIndex=0] The uriIndex for this feature URI
     * @returns {HelperFeature} The feature skeleton (without the scenarios)
     * @private
     */
    _buildFeatureSkeleton(uri, uriIndex=0){
        return {
            testCases: [],
            uri,
            fileName: uri.substr(uri.lastIndexOf('/')+1),
            uriIndex,
            sameAs(feature){
                return (this.uri === feature.uri && this.uriIndex === feature.uriIndex);
            }
        };
        //TODO: read file and procees name, text, tags, etc.
    }


    /**
     * Transforms an array of test cases to feature-grouped objects
     * @param {HelperTestCase[]} tCases The test case to transform to a feature array
     * @returns {HelperFeature[]} The reversed engineered feature objects
     */
    testCasesToFeatures(tCases){
        let lastURI;
        let features = tCases.reduce((acc, tCase) => {
            /** @type {HelperFeature[]} */
            let matchingFeatures = acc.filter(feature => feature.uri === tCase.uri);
            let scenarioFeature = matchingFeatures[matchingFeatures.length-1];

            if (scenarioFeature === undefined) {
                scenarioFeature = singleton._buildFeatureSkeleton(tCase.uri);
                acc.push(scenarioFeature);
            } else {
                if (lastURI !== scenarioFeature.uri) {
                    scenarioFeature = singleton._buildFeatureSkeleton(tCase.uri, scenarioFeature.uriIndex);
                    acc.push(scenarioFeature);
                }
            }

            lastURI = scenarioFeature.uri;
            tCase.feature = scenarioFeature;
            tCase.featureIndex = scenarioFeature.testCases.length;
            scenarioFeature.testCases.push(tCase);
            tCase.sameAs = function(compareTo){return (tCase.uri === compareTo.uri && tCase.featureIndex === compareTo.featureIndex);};
            return acc;
        }, []);

        return features;
    }

}

module.exports = Utils;