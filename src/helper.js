/** @type {Helper} */
// eslint-disable-next-line consistent-this
let singleton = undefined;

/**
 * CucumberJS helper - the user facing facade
 */
class Helper {
    /**
     * Returns the singleton helper instance
     * @param {boolean} [forceNew=false] Force create a new helper instance
     * @returns {Helper}
     */
    constructor(forceNew = false){
        if (singleton !== undefined && !forceNew) return singleton;

        singleton = this;

        try {
            /** @type {Cucumber} */
            this.cucumber = require('cucumber');
        } catch (e) {
            throw new Error(`Failed to require the cucumber package. Make sure to install it separately: ${e.message}`);
        }

        /** @type {HelperCore} */
        this.core = new (require('./helperCore'))(this);
        this.helperPath = require('path').resolve(__dirname);
    }

    /**
     * Returns a new Helper object
     * @returns {Helper}
     */
    getNew(){
        return new Helper(true);
    }

    /**
     * Returns information regarding the current state of the test run
     * @returns {HelperRunState} A clone of the current run state
     */
    get currentRun() {
        return require('safe-clone-deep')(singleton.core.currentRun);
    }

    /**
     * Sets the user's test case manipulator function
     * @param {function(TestCase[]):TestCase[]} userFunction The user's test case manipulation method
     */
    setTestCaseManipulator(userFunction){
        singleton.core.userFunctions.testCasesManipulator = userFunction;
    }

    /**
     * Sets the user hook function
     * @param {string} hookName The hook to set
     * @param {function} userFunction The hook function
     */
    setHook(hookName, userFunction){
        singleton.core.setHook(hookName, userFunction);
    }
}

module.exports = Helper;