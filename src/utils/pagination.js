/**
 * This function calculates the limit and offset for pagination.
 * @param {number} page
 * @returns {Object} An object containing the limit and offset for pagination.
 */

module.exports = (page)=>{
    const limit = 10;
    const offset = (page - 1) * limit;
    return {limit, offset};
}