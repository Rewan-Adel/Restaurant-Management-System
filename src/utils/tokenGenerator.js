const JWT = require('jsonwebtoken');
const {
    secret,
    expiresIn
} = require('../config/token');

/**
 * Generate a token for a user.
 * @param   {object} user - The user details to be included in the token payload.
 * @returns {String} - The generated token.
 */
module.exports= (user) =>{
    return JWT.sign({
        id: user.id
    }, secret, {expiresIn});
};