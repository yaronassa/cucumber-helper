/**
 * This file contains JSDOC typedefs used throughout the project
 */

/**
 * @typedef {object} Location Represents a cucumber pickle location
 * @property {number} line The line in the target file
 * @property {number} column The column in the target file
 */

/**
 * @typedef {object} HelperResult
 * @property {boolean} result The operation pass/fail status
 * @property {string} error_message? The operation error message
 * @property {object} original_result? The original result of the operation
 */

/**
 * @typedef {Step} HelperStep Represents a helper processed cucumber step
 * @property {HelperResult} result The step result (appended by the helper)
 * @property {HelperTestCase} testCase
 * @property {number} duration The step duration in ms (not guaranteed to be exactly like cucumber)
 */

/**
 * @typedef {object} Step Represents a cucumber pickle step
 * @property {Array<{content: string, location: Location}>} arguments The step arguments
 * @property {Location[]} locations The step locations
 * @property {string} text The step text
 */


/**
 * @typedef {TestCase} HelperTestCase Represents a helper processed cucumber test case
 * @property {HelperFeature} feature The feature this test case belongs to
 * @property {HelperResult} result The test case final result
 * @property {HelperStep[]} pickle.steps The test case processed steps
 * @property {number} featureIndex The zero-based index of this test case in its parent feature
 * @property {function(HelperTestCase):boolean} sameAs Is this test case the same as the tested one
 * @property {number} duration The step duration in ms (not guaranteed to be exactly like cucumber)
 */

/**
 * @typedef {object} TestCase Represents a cucumber pickle (scenario)
 * @property {string} uri The test case feature URI
 * @property {string} pickle.language The pickle language signature
 * @property {string} pickle.name The test case name
 * @property {Step[]} pickle.steps The test case steps
 * @property {Location[]} pickle.locations The scenario location
 * @property {Array<{name: string, location: Location}>} pickle.tags The test case compounded tags
 */

/**
 * @typedef {object} HelperFeature A reversed engineered feature
 * @property {string} uri The feature URI
 * @property {HelperTestCase[]} testCases
 * @property {string} fileName
 * @property {number} [uriIndex=0] In case a physical feature was split due to tCase manipulation, the uri index of this feature
 * @property {HelperResult} result
 * @property {function(HelperFeature):boolean} sameAs Is this feature the same as the tested one
 * @property {number} duration The step duration in ms (not guaranteed to be exactly like cucumber)
 */

/**
 * @typedef {object} HelperRunState
 * @property {HelperFeature[]} features
 * @property {HelperTestCase[]} testCases
 * @property {HelperFeature} currentFeature
 * @property {HelperTestCase} currentTestCase
 * @property {HelperStep} currentStep
 */
