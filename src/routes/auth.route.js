const router = require('express').Router();
const {
    register,
    login,
    sendResetPassEmail,
    verifyAndResetPass
} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);

router.post('/forgot-password', sendResetPassEmail);
router.post('/reset-password', verifyAndResetPass);

module.exports = router;