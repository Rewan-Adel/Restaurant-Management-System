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
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

router.use(isAuthenticated);

router.post('/new', createOrder);
router.get('/all', getOrdersByStaff);
router.get('/one/:orderID', getOneOrderByStaff);
router.put('/complete/:orderID', markOrderAsCompleted);

//For both staff and admin
router.put('/add/:orderID', addItemsToOrder);
router.put('/remove/:orderID', removeItemsFromOrder);


router.use(isAdmin);
router.get('/admin/all', getAllOrders);
router.get('/admin/one/:orderID', getOneOrder);
router.put('/admin/mark/:orderID', changeOrderStatus);
router.delete('/admin/delete/:orderID', deleteOrder);

module.exports = router;
