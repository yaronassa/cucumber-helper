#!/usr/bin/env node

let Promise = require('bluebird');
let Cli = require('../src/index').cucumber.Cli;

/**
 * Exist the process after printing out the current error
 * @param {Error} error
 */
function exitWithError(error) {
    console.error(error);
    process.exit(1);
}

/**
 * Runs cucumber through the helper
 * @returns {Promise<boolean>}
 */
function run(){
    return Promise.try(function(){
        const cwd = process.cwd();
        const cli = new Cli({
            argv: process.argv,
            cwd,
            stdout: process.stdout
        });

        return cli.run();
    });
}

/**
 * Actually starts and processes a cucumber run
 */
run()
    .then(success => {
        const exitCode = success ? 0 : 1;

        /**
         * Exists the process with the given exit code
         */
        function exitNow() {
            process.exit(exitCode);
        }

        // If stdout.write() returned false, kernel buffer is not empty yet
        if (process.stdout.write('')) {
            exitNow();
        } else {
            process.stdout.on('drain', exitNow);
        }
    })
    .catch(e => exitWithError(e));