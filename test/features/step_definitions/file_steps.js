/**
 * @see https://github.com/cucumber/cucumber-js/blob/master/features/step_definitions/file_steps.js
 */

let { defineSupportCode } = require('cucumber');
let { promisify } = require('bluebird');
let fsExtra = require('fs-extra');
let path = require('path');

defineSupportCode(function({ Given }) {
    Given(/^a file named "(.*)" with:$/, function(filePath, fileContent) {
        const absoluteFilePath = path.join(this.tmpDir, filePath);
        if (filePath === '@rerun.txt') {
            fileContent = fileContent.replace(/\//g, path.sep);
        }
        return promisify(fsExtra.outputFile)(absoluteFilePath, fileContent);
    });

    Given(/^an empty file named "(.*)"$/, function(filePath) {
        const absoluteFilePath = path.join(this.tmpDir, filePath);
        return promisify(fsExtra.outputFile)(absoluteFilePath, '');
    });

    Given(/^a directory named "(.*)"$/, function(filePath) {
        const absoluteFilePath = path.join(this.tmpDir, filePath);
        return promisify(fsExtra.mkdir)(absoluteFilePath);
    });
});