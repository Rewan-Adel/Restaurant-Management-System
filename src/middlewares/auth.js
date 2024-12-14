const JWT = require('jsonwebtoken');
const {failedResponse} = require('../middlewares/response');
const {User} = require('../config/Database');
/**
 * Middleware to verify if the user is authenticated.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware function.
 */
exports.isAuthenticated   = async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return failedResponse(res, 'Authorization token is missing or invalid.', 401);
    }
    const token = authHeader.split(' ')[1];
    if (!token)
        return failedResponse(res, 'Please, login to get access.', 401);

    try{
        const decoded = JWT.verify(token, process.env.TOKEN_SECRET);        
        const user = await User.findByPk(decoded.id);
        if(!user){
            return failedResponse(res, 'User not found.', null, 404);
        }
        
        if(user.passResetToken !== null){
            return failedResponse(res, 'Please, reset your password.', 401);
        }
        else if(user.passResetExpire && user.passResetExpire < Date.now()){
            return failedResponse(res, 'Password reset token expired.', 401);
        };
        req.user = user;
        next();
    }
    catch(error){
        console.log(error);
        return failedResponse(res, 'Please, login to get access.', 401);
    }
};
/**
 * Middleware to check if the authenticated user has admin permissions.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware function.
 */
exports.isAdmin = async(req, res, next) => {
    try{
        const {id} = req.user;
        const user = await User.findByPk(id);
        if(user.role !== 'admin'){
            return failedResponse(res, 'You do not have the permissions.', 403);
        }
        next();
    }
    catch(error){
        console.log(error);
        return failedResponse(res, 'Unauthorized', 401);
}};
