# Disclaimer

This project isn't affiliated in any manner with the official [cucumber](https://cucumber.io/) / [cucumberJS](https://github.com/cucumber/cucumber-js) projects, nor does it have their explicit or implicit support.
In fact, this project's philosophy directly opposes that of the official cucumber implementations.

## About this project

Cucumber, and specifically its cucumberJS implementation are wonderful tools for test automation and collaborative work.
While these projects are right to focus on mainstream requirements and popular use-cases, they leave much of these tools potential untapped.

With cucumberJS version 3, me and other tinkerers found ourselves "locked out" of hacks and workarounds we came to rely on.
This helper is meant to bring back some of that functionality, as well as provide additional manipulation options and enhancements.

## Stability and robustness

**TL;DR - May break at any time. Use at your own risk.**

Many of the capabilities this helper provides require overriding and manipulating the internal code-structures of cucumber.
Currently, I attempt to implement these without changing the actual source code of cucumber's package.
This means that every new version of cucumberJS (even minor versions) might break some / most of the helper's features.

I will attempt to produce an upgraded version of the helper that fixes the issues, but there may come a time when that will no longer be possible (without changing the source code).

If you use this helper in your project's, be aware - it may break at any time. Use at your own risk. 
 
 
# Helper features

The helper has these main features:

- Reinstate the hooks from v2, with similar parameters, where possible.
- Manipulate the scenario-stack before the run starts (remove, reorder, change).
- Manipulate each scenario's step stack before it runs (remove, reorder, change).
- Manipulate step functions in-arguments and results.
- Get information on the current state of the run.

# Usage

Using each feature is described under the [API Details](#api-details) section. However, in order for the helper to function properly, cucumber **must** be run from the helper itself.

#### Programmatically

If you're already launching cucumber programmatically (i.e. you have something like `cli.run()` in your code), then the adjustment is extremely easy.
Instead of working with `let cucumber = require('cucumber')`, use `let cucumber = require('cucumber-helper').cucumber;`.

That's it, you're done. Everything else in your code should work while remaining exactly the same.

#### Externally

If you're using cucumber externally (i.e. from the command line, an editor that launches it internally, etc.), you'll have to redirect that external process to work with the helper.
Check the command you're currently executing. Most likely it's `node_modules/.bin/cucumberjs` (or maybe `cucumber-js`). 

Simply change that to `node_modules/.bin/cucumber-helper` and you'll be set to go.

# API details

Using the helper is relatively straightforward - add a `helper.js` file to your `features/support` folder (the file name is just for clarity - it can have any name you'd like).
In the file, require the helper package, and use it according to the API Details section below. 

*Data structures and type definitions specified throughout the samples are specified at under [type definitions](typedefs.md)

## Scenario stack manipulations

The helper supports the possibility to change the scenario run stack before the run actually starts.
You can filter, change the order, remove, duplicate or even manually add new testCases as needed.

**Usage**: `helper.setTestCaseManipulator(function(tCases){return manipulatedTCases;});`

Where `manipulatedTCases` is a new array of test cases.

**Example**
```javascript
  let helper = require('cucumber-helper');
  helper.setTestCaseManipulator(
      /**
      * A function to manipulate the test case stack (i.e. the test run scenarios)
      * @param {TestCase[]} tCases The array of testCases for this run
      * @returns {TestCase[]} A manipulated array of test cases (you can change the order and contents, delete and add test cases)
      */
      function(tCases){
      //Reverse the order of the test cases
        return tCases.reverse();
    });
```

## Run information

In any time, you can invoke `helper.currentRun` and receive the current test case, and step.
Please note, that the returned information is disconnected from cucumber (i.e. changing it will not affect the actual run).
Hooks and other functions may receive actionable objects that changing them can and will affect the run.


## Hooks

The helper attempts to track the hooks from V2, with similar parameters (where possible).
If your hook function is a-synchronous, it must return a native/bluebird Promise.
Some hooks receive run-related information, and some even support manipulating that information as a way to dynamically affect the test run.

**Usage**:  `helper.setHook('hookName', myFunction(){/*Do Something*/});`

The Available hooks are:

#### BeforeFeatures

- Executed right before the cucumber Runtime starts the actual run.
- Receive an immutable array of features this run will include (feature = all scenarios under a given URI).
- The features are pre-test-case-mutation.

**Example**
```javascript
  let helper = require('cucumber-helper');
  helper.setHook('beforeFeatures',
      /**
      * A function to act according to the original feature stack
      * @param {Feature[]} features The run features (prior to setTestCaseManipulator effect)
      */
      function(features){
        console.log(features.length)
    });
```

#### BeforeAll

- Performs the regular V3 BeforeAll hook action.
- Can be set either from the helper, or regularly from the cucumber defineSupportCode interface (or both, if you really want to)

For more details see [cucumberJS BeforeAll](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/hooks.md#beforeall--afterall).

#### BeforeScenario

- Executes right before the cucumber Runtime starts processing the next scenario.
- Allows you to manipulate the coming scenario (add/remove steps, change its attributes, etc.)

**Example**
```javascript
  let helper = require('cucumber-helper');
  helper.setHook('beforeScenario',
      /**
      * A function to manipulate the upcoming scenario
      * Note - Any changes to the tCase object will persist, the function doesn't need to return anything
      * @param {TestCase} tCase The upcoming test case
      */
      function(tCase){
        //Delete the last step in the scenario
        if (tCase.pickle.name === 'something') tCase.pickle.steps.pop();
    });
```

#### Before

- Performs the regular V3 Before hook action
- Support returning 'skipped' to skip the next scenario
- Can be set either from the helper, or regularly from the cucumber defineSupportCode interface (or both, if you really want to)


For more details see [cucumberJS Before](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/hooks.md#hooks).

#### BeforeStep

- Runs right before the step is executed
- Allows you to manipulate the step parameters before they are passed to the step function
- Allows you to plant information that can be used by the AfterStep hook.

**Example**
```javascript
  let helper = require('cucumber-helper');
  helper.setHook('beforeStep',
      /**
      * A function to manipulate the upcoming step's arguments
      * @param {Step} step The upcoming step (immutable)
      * @param {Array} args The upcoming step function arguments
      * @returns {Array} A modified array of function arguments
      */
      function(step, args){
        console.log(step.text);
        step._myInfo = 'Can be used in AfterStep';
        //Append the first argument (
        let newArgs = [].concat(args);
        newArgs[0] = newArgs[0] + ' hook';
        return newArgs;
    });
```

#### AfterStep

- Runs right after a step in executed
- Receives the step (and ant field set on it by BeforeStep), and its result / a {__helperError : Error} object in case of step failure
- If the hook returns any value, the original error will be ignored, and the step will pass.
- You can throw a new error to changed the fail reason

```javascript
  let helper = require('cucumber-helper');
  helper.setHook('afterStep',
      /**
      * A function to manipulate the step result
      * @param {Step} step The upcoming step (immutable)
      * @param {Array} args The upcoming step function arguments
      * @returns {Array} A modified array of function arguments
      */
      function(step, args){
        console.log(step.text);
        if (step._myInfo) console.log('Info from beforeStep: ' + step._myInfo);
        //Append the first argument (
        let newArgs = [].concat(args);
        newArgs[0] = newArgs[0] + ' hook';
        return newArgs;
    });
```

#### After

- Performs the regular V3 Before hook action
- Can be set either from the helper, or regularly from the cucumber defineSupportCode interface (or both, if you really want to)

For more details see [cucumberJS After](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/hooks.md#hooks).

#### AfterScenario

- Executes after the regular V3 after hook
- Gets the tCase object that BeforeScenario manipulated

**Example**
```javascript
  let helper = require('cucumber-helper');
  helper.setHook('afterScenario',
      /**
      * A function to act on the finished scenario
      * @param {TestCase} tCase The finished test case
      */
      function(tCase){
        console.log(tCase.pickle.name);
    });
```

#### AfterAll

- Performs the regular V3 BeforeAll hook action.
- Can be set either from the helper, or regularly from the cucumber defineSupportCode interface (or both, if you really want to)

For more details see [cucumberJS BeforeAll](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/hooks.md#beforeall--afterall).

#### AfterFeatures

- Executes after the entire run has finished and the results have been outputted
- Allows you to manipulate the JSON result (for example).
- Receives the run boolean status, and allows you to return an alternate status

**Example**
```javascript
  let helper = require('cucumber-helper');
  helper.setHook('afterFeatures',
      /**
      * A function to manipulate the end run result
      * @param {boolean} result The run result
      */
      function(result){
        //You can access helper.currentRun.testCases and see all the run scenarios and their results
        return true; //The run will pass (exit code will be 0)
    });
```

