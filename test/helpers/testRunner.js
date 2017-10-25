/**
 * @typedef {object} RunResult
 * @property {boolean} result
 * @property {string} stdout
 * @property {string} stderr
 * @property {object} jsonResult
 */

let Promise = require('bluebird');
let fsExtra = require('fs-extra');

/**
 * Runs test against the helper
 */
class TestRunner {
    /**
     * Initializes the class
     */
    constructor(){
        /** @type {Helper} */
        this.helper = (require('../../src/index')).getNew();
        this.tempDir = require('path').resolve(__dirname,'../../', 'temp');
        this.defaultRunArgs = ['./', '--format', 'json:out.json'];
        fsExtra.emptyDirSync(this.tempDir);
    }

    /**
     * Actually runs the tests
     * @param {string[]} [additionalArgs=Array]
     * @returns {Promise<RunResult>}
     */
    run(additionalArgs = []){
        let _self = this;
        let runArgs = this.defaultRunArgs.concat(additionalArgs);

        let runProcess;
        let spawnArgs = ['../bin/runThroughHelper.js'].concat(runArgs);

        return new Promise((resolve, reject) => {
            let stdoutOutput = [];
            let stderrOutput = [];
            let newEnv = Object.assign({}, process.env);
            newEnv.helperPath = _self.helper.helperPath;

            runProcess = require('child_process').spawn('node', spawnArgs, {cwd : _self.tempDir, env: newEnv});

            runProcess.stdout.on('data', function(data){
                let str = data.toString();
                stdoutOutput.push(str.trim());
            });

            runProcess.stderr.on('data', function(data){
                let str = data.toString();
                stderrOutput.push(str);
            });

            /**
             * Combines and returns the run output
             * @return {{stdout: string, stderr: string}}
             */
            function getOutput(){
                let stdout = runProcess.stdout.read() || '';
                let stderr = runProcess.stderr.read() || '';

                stderr = stderrOutput.join('') + stderr.toString();
                stdout = stdoutOutput.join('') + stdout.toString();

                return {
                    stdout,
                    stderr
                };
            }

            runProcess.on('error', function(error){
                let output = getOutput();
                runProcess.kill();
                reject(new Error('Error spawning test process ' + output.stderr + '\n' + error.stack.toString() + '\n\n. Output: ' + output.stdout));
            });

            runProcess.on('exit', function(exitCode){
                let output = getOutput();
                runProcess.kill();
                return resolve({result: exitCode === 0, stdout: output.stdout, stderr: output.stderr});
            });

        }).then(result => {
            try {
                result.jsonResult = JSON.parse(require('fs').readFileSync(require('path').resolve(_self.tempDir, 'out.json')));
            } catch (e) // eslint-disable-next-line no-empty
            {}

            return result;
        });
    }
}

module.exports = TestRunner;