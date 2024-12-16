const router = require('express').Router();
const {
    createOrder,
    changeOrderStatus,
    addItemsToOrder,
    removeItemsFromOrder,
    getAllOrders,
    getOneOrder,
    deleteOrder,
    getOrdersByStaff,
    getOneOrderByStaff,
    markOrderAsCompleted,
    report
} = require('../controllers/order.controller');
const { isAuthenticated, isAdmin, isStaff } = require('../middlewares/auth');

router.use(isAuthenticated);
router.put('/add/:orderID', addItemsToOrder);
router.put('/remove/:orderID', removeItemsFromOrder);


router.post('/new', isStaff,createOrder);
router.get('/all', isStaff, getOrdersByStaff);
router.get('/one/:orderID',isStaff, getOneOrderByStaff);
router.put('/complete/:orderID',isStaff, markOrderAsCompleted);


router.use(isAdmin);
router.get('/admin/all', getAllOrders);
router.get('/admin/one/:orderID', getOneOrder);
router.put('/admin/mark/:orderID', changeOrderStatus);
router.delete('/admin/delete/:orderID', deleteOrder);
router.get('/admin/report', report);

module.exports = router;
