/**
 * @type {Helper}
 */
function getHelperInstance(){
    return new (require('./helper'))();
}

/** @type {Helper} */
module.exports = getHelperInstance();