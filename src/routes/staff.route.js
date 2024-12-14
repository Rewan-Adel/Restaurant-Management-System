const router = require('express').Router();
const {
    getAllStaff,
    getStaffMember,
    deleteStaffMember,
    makeAdmin
} = require('../controllers/staff.controller');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

router.use(isAuthenticated);
router.use(isAdmin);

router.get('/',  getAllStaff);
router.get('/get/:memberID', getStaffMember);

router.put('/make-admin/:memberID', makeAdmin);
router.delete('/delete/:memberID',  deleteStaffMember);

module.exports = router;