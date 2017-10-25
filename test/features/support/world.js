let { defineSupportCode } = require('cucumber');
let path = require('path');
let figures = require('figures');

/**
 * Test Cucumber world
 */
class World {
    /**
     * Initializes the class
     */
    constructor() {
        /** @type {TestRunner} */
        this.testRunner = new (require('../../helpers/testRunner'))();
        this.tmpDir = this.testRunner.tempDir;
    }

    /**
     * normalizes text for quick and cleaner validations
     * @param {string} text Source text to normalize
     * @see https://github.com/cucumber/cucumber-js/blob/master/features/support/helpers.js
     * @returns {string}
     */
    normalizeText(text) {
        return figures(text)
            .replace(/\033\[[0-9;]*m/g, '')
            .replace(/\r\n|\r/g, '\n')
            .trim()
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\d+m\d{2}\.\d{3}s/, '<duration-stat>')
            .replace(/\d+(.\d+)?ms/g, '<d>ms')
            .replace(/\//g, path.sep)
            .replace(/ +/g, ' ')
            .split('\n')
            .map(line => line.trim())
            .join('');
    }
}

defineSupportCode(({ setWorldConstructor }) => {
    setWorldConstructor(World);
});