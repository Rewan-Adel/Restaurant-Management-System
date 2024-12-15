const {User}        = require('../config/Database');
const {successResponse, failedResponse, errorResponse} = require('../middlewares/response');

/**
 * Get all staff Members.
 * @method  GET
 * @param   {Object} req - The request object.which should include the query parameter `page`.
 * @param   {Object} res - The response object.
 * @returns {Object} - A JSON response containing:
 * - `message`: All staff members
 * - `data`:
 * - `staff`: The staff members details.
 * - `staffMembers`: The total number of staff members.
 *  - `totalPages`: The total number of pages based on the limit.
 *  - `currentPage`: The current page number.
 * */
exports.getAllStaff = async (req, res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    try {
        const staff = await User.findAndCountAll({
            where: { role: 'staff' },
            limit,
            offset
        });
        return successResponse(res, "All staff members", {
            staff: staff.rows,
            staffMembers: staff.count,
            totalPages: Math.ceil(staff.count / limit),
            currentPage: page
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, error.message);
    };
};
/**
 * Get a single staff member.
 * @method  GET
 * @param   {Object} req - The request object, which should include the staff member id {memberID}.
 * @param   {Object} res - The response object.
 * @returns {Object} - A JSON response containing:
 * - `message`: Staff member details
 * - `data`:
 * - `staff`: The staff member details.
 * */
exports.getStaffMember= async (req, res)=>{
    const { memberID } = req.params;
    if(!memberID) return failedResponse(res, "Staff member id is required");
    try {
        const staff = await User.findOne({ where: { userID:memberID, role: 'staff' } });
        if (!staff) return failedResponse(res, "Staff member not found", null, 404);
        return successResponse(res, "Staff member details", { staff });
    } catch (error) {
        console.log(error);
        return errorResponse(res, error.message);
    };
};
/**
 * Update a staff member to be an admin.
 * @method  PUT
 * @param   {Object} req - The request object, which should include the staff member id {memberID}.
 * @param   {Object} res - The response object.
 * @returns {Object} - A JSON response containing:
 * - `message`: Staff member is admin now.
 * - `data`:
 * - `staff`: The updated staff member details.
 * */
exports.makeAdmin = async (req, res)=>{
    const { memberID } = req.params;
    if(!memberID) return failedResponse(res, "Staff member id is required");
    try {
        const staff = await User.findOne({ where: { userID:memberID, role: 'staff' } });
        if (!staff) return failedResponse(res, "Staff member not found", null, 404);
        staff.role = 'admin';
        await staff.save();
        return successResponse(res, `${staff.username} is admin now`, { staff });
    } catch (error) {
        console.log(error);
        return errorResponse(res, error.message);
    };
};
/**
 * Delete a staff member.
 * @method  DELETE 
 * @param   {Object} req - The request object, which should include the staff member id.
 * @param   {Object} res - The response object.
 * @returns {Object} - A JSON response containing:
 * - `message`: Staff member deleted successfully.
 * */
exports.deleteStaffMember= async (req, res)=>{
    const { memberID } = req.params;
    if(!memberID) return failedResponse(res, "Staff member id is required");
    try {
        const staff = await User.findOne({ where: { userID:memberID, role: 'staff' } });
        if (!staff) return failedResponse(res, "Staff member not found", null, 404);
        await staff.destroy();
        return successResponse(res, "Staff member deleted successfully");
    }catch (error) {
        console.log(error);
        return errorResponse(res, error.message);
    };
};