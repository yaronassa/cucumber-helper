//Executes helper externally and report back the results

/** @type {Helper} */
let helper = require('../../src/index');
let cucumber = helper.cucumber;

let cli = new (cucumber.Cli)({argv : process.argv, cwd: process.cwd(), stdout: process.stdout});

return cli.run('./')
    .then(res => {
        process.exit((res === true) ? 0 : 1);
    })
    .catch(e => {
        console.error(e.stack);
        process.exit(1);
    });
