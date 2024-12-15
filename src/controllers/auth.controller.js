const bcrypt        = require('bcrypt');
const {User}        = require('../config/Database');
const generateToken = require('../utils/tokenGenerator');
const {successResponse, failedResponse, errorResponse} = require('../middlewares/response');
const {registerValidation, loginValidation} = require('../validation/user.validation');

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
    console.log(req.body);
    
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


