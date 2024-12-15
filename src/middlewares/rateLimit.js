const rateLimit   = require('express-rate-limit');
const {failedResponse} = require('./response');
/**
 * Rate limiting middleware to prevent abuse.
 */

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    handler: (req, res) => {
        return failedResponse(res, 'Too many requests, please try again after 15 minutes', null, 429);
    }
});