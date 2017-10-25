/**
 * This file contains JSDOC typedefs used throughout the project
 */

/**
 * @typedef {object} Location Represents a cucumber pickle location
 * @property {number} line The line in the target file
 * @property {number} column The column in the target file
 */


/**
 * @typedef {object} Step Represents a cucumber pickle step
 * @property {Array<{content: string, location: Location}>} arguments The step arguments
 * @property {Location[]} locations The step locations
 * @property {string} text The step text
 */

/**
 * @typedef {object} TestCase Represents a cucumber pickle (scenario)
 * @property {string} uri The test case feature URI
 * @property {string} pickle.language The pickle language signature
 * @property {string} pickle.name The test case name
 * @property {Step[]} pickle.steps The test case steps
 * @property {Array<{name: string, location: Location}>} pickle.tags The test case compounded tags
 * @property {boolean} result.result The helper end result for this test case
 * @property {string} result.error_message The helper error message for this test case
 */

/**
 * @typedef {object} Feature A reversed engineered feature
 * @property {string} uri The feature URI
 * @property {TestCase[]} scenarios
 * @property {string} fileName
 */