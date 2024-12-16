const bcrypt        = require('bcrypt');
const {User}        = require('../config/Database');
const generateToken = require('../utils/tokenGenerator');
const {successResponse, failedResponse, errorResponse} = require('../middlewares/response');
const {registerValidation, loginValidation, emailValidation} = require('../validation/user.validation');
const sendEmail     = require('../utils/sendEmail');
const e = require('express');

/**
 * Register a new user.
 * @method  POST
 * @param   {JSON} req - The request object, which should include the user details in the request body.
 * @param   {Object} res - The response object used to send back the response.
 * @returns {Object} - A JSON response containing:
 * - `message`: User registered successfully
 * - `data`:
 *  - `user`: The user details.
 *  - `token`: The JWT token for the user.
 */
exports.register = async (req, res) =>{
    const { error, value } = registerValidation(req.body);
    if (error) return failedResponse(res, error.details[0].message);
    try {
        const userExists = await User.findOne({ where: { email: value.email } });
        if (userExists) return failedResponse(res, "Email already exists");
        const user = await User.create(value);
        const token = generateToken(user);
        return successResponse(res, "User registered successfully", {user, token}, 201);
    } catch (error) {
        return errorResponse(res, error.message);
    };
};

/**
 * @method - POST
 * @param - req - The request object, which should include the user details in the request body.
 * @param - res - The response object used to send back the response.
 * @returns - A JSON response containing:
 * - `message`: User logged in successfully
 * - `data`:
 * - `user`: The user details.
 * - `token`: The JWT token for the user.
 */
exports.login = async(req, res) =>{
    const { error, value } = loginValidation(req.body);
    if (error) return failedResponse(res, error.details[0].message);
    try {
        const user = await User.findOne({ where: { email: value.email } });
            
        if(!user || !await bcrypt.compare(value.password, user.password))
            return failedResponse(res, "Invalid email or password");
        const token = generateToken(user);
        return successResponse(res, "User logged in successfully", {user, token});
    } catch (error) {
        return errorResponse(res, error.message);
    };
};
/**
 * Forgot password with email.
 * @method - POST
 * @param - req - The request object, which should include the user email in the request body.
 * @param - res - The response object used to send back the response.
 * @returns - A JSON response containing:
 * - `message`: Email sent successfully
 */
exports.sendResetPassEmail = async (req, res) => {
    const { error, value } = emailValidation(req.body);
    if (error) return failedResponse(res, error.details[0].message);

    const user = await User.findOne({ where: { email: value.email } });
    if (!user)
        return failedResponse(res, 'Invalid email address');
    const otp = Math.floor(100000 + Math.random() * 900000);
    const sendCode = sendEmail(otp, value.email);
    if (!sendCode) 
        return failedResponse(res, 'Failed to send email');

    user.passResetToken  = await bcrypt.hash(otp.toString(), 10);
    user.passResetExpire = Date.now() + 10 * 60 * 1000;
    await user.save();
    
    return successResponse(res, 'verification code is sent, check your inbox');
};
/**
 * Reset password with email.
 * @method - POST
 * @param - req - The request object, which should include the verification code and new password in the request body.
 * @param - res - The response object used to send back the response.
 * @returns - A JSON response containing:
 * - `message`: Password reset successfully
 * - `data`:
 * - `token`: The JWT token for the user.
 */
exports.verifyAndResetPass = async (req, res) => {
    const { code , newPassword} = req.body;
    const user = await User.findOne({
        where:{email: req.body.email }
    });

    if (!user) 
        return failedResponse(res, 'Invalid email address');

    else if(user.passResetToken === null)
        return failedResponse(res, 'You have already reset your password');

    else if ( !await bcrypt.compare(code.toString(), user.passResetToken))
        return failedResponse(res, 'Invalid Verification code.');
    
    else if (!newPassword || newPassword.length < 6) 
        return failedResponse(res, 'Password must be at least 6 characters long');
    
    user.password        = req.body.newPassword;  
    user.passResetToken  = null;
    user.passResetExpire = null;
    await user.save();

    const token =  generateToken(user);
    return successResponse(res, 'Password reset successfully', { token });
};
