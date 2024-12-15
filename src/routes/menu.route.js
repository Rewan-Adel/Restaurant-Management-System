const router = require('express').Router();
const limitRequest  = require('../middlewares/rateLimit');

const {
    getAllItems,
    getOneItem,
    createItem,
    updateItem,
    deleteItem,
    topSellingItems
} = require('../controllers/menu.controller');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

router.get('/', getAllItems);
router.get('/item/:itemID', getOneItem);
router.get('/top-selling', topSellingItems);

router.use(isAuthenticated);
router.use(isAdmin);

router.post('/admin/add',  limitRequest,  createItem);
router.put('/admin/update/:itemID',  updateItem);
router.delete('/admin/delete/:itemID',  deleteItem);

module.exports = router;