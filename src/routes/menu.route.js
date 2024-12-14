const router = require('express').Router();
const {
    getAllItems,
    getOneItem,
    filtration,
    createItem,
    updateItem,
    deleteItem,
} = require('../controllers/menu.controller');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

router.get('/', getAllItems);
router.get('/item/:itemID', getOneItem);
router.get('/filter', filtration);

router.use(isAuthenticated);
router.use(isAdmin);

router.post('/admin/add',  createItem);
router.put('/admin/update/:itemID',  updateItem);
router.delete('/admin/delete/:itemID',  deleteItem);

module.exports = router;