const { Op, Sequelize } = require('sequelize');
const  { Item, Category, OrderItem, Order } = require('../config/Database');
const pagination = require('../utils/pagination');

const { successResponse,
        failedResponse,  
        errorResponse
    } = require('../middlewares/response');

const {addValidation,
    updateValidation
} = require('../validation/item.validation');
const OrderItems = require('../models/order_items.model');

/**
 * Retrieve all items with pagination and filtration by category name and price sort.
 * @method  GET
 * @param   {Object} req - The request object, which should include the query parameter `page`.
 * @param   {Object} res - The response object used to send back the response.
 * @returns {Object} - A JSON response containing:
 * - `message`: Items retrieved successfully
 * - `data`:
 *  - `items`: The items retrieved from the database (paginated).
 *  - `total`: The total number of items in the database.
 *  - `totalPages`: The total number of pages based on the limit.
 *  - `currentPage`: The current page number.
*/    
exports.getAllItems = async (req, res) => {
    const page = parseInt(req.query.page) || 1;    
    const {limit, offset} = pagination(page);
    const category   = req.query.category   || ''; 
    const sort = req.query.sort || 'ASC'; 
    const whereClause = category
    ? isNaN(category) 
        ? { name: { [Op.like]: `%${category}%` } }
        : { categoryID: category } 
    : {};
    try {
        const items = await Item.findAndCountAll({ 
            limit,
            offset,
            include: [{
                model: Category,
                as: 'category',
                required: true,
                where: whereClause
                }],
            attributes: { exclude: ['categoryID'] },
            order: [['price', sort]] 
        });
        return successResponse(res, "Items retrieved successfully", {
            items: items.rows,
            total: items.count,
            totalPages: Math.ceil(items.count / limit),
            currentPage: page
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, error.message);
    }
}
/**
 * Retrieve a single item by its ID.
 * @method  GET
 * @param   {Object} req - The request object, which should include the item ID as a parameter.
 * @param   {Object} res - The response object used to send back the response.
 * @returns {Object} - A JSON response containing the retrieved item.
 *  `message`: Item retrieved successfully
 * - `data`:
 *  - `item`: The item retrieved from the database.
 * @throws  {Object} - A JSON response containing an error message if the item is not found.
 */
exports.getOneItem = async (req, res) => {
        const itemID = req.params.itemID;
        if (!itemID) return failedResponse(res, "Item ID is required");
        
        try {
            const item = await Item.findByPk(itemID,{
                include: [{ model: Category, as: 'category' }],
                attributes: { exclude: ['categoryID'] }
            }); 

            if (!item) return failedResponse(res, "Item not found", null, 404);

            return successResponse(res, "Item retrieved successfully", { item });

        } catch (error) {
            console.log(error);
            return errorResponse(res, error.message);
        }
};

/**
 * Retrieve top 10 selling items in the menu last 30 days.
 * @method  GET
 * @param   {Object} req - The request object.
 * @param   {Object} res - The response object used to send back the response.
 * @returns {Object} - A JSON response containing:
 */
exports.topSellingItems = async (req, res) => {
    try {
        const topItems = await OrderItems.findAll({
            attributes: [
                'itemID',
                [OrderItems.sequelize.fn('SUM', OrderItems.sequelize.col('quantity')), 'totalSold'],
                [Sequelize.col('item.name'), 'name'],
                [Sequelize.col('item.price'), 'price']
            ],
            include: [
                {
                    model: Item,
                    as: 'item',
                    attributes: [] // Prevent duplication of attributes
                },
                {
                    model: Order,
                    as: 'order',
                    attributes: [],
                    where: {
                        status: 'completed',
                        createdAt: {
                            [Op.gte]: Sequelize.literal('NOW() - INTERVAL 30 DAY') // Last 30 days
                        }
                    }
                }
            ],
            group: ['itemID', 'item.name', 'item.price'], // Include related fields in GROUP BY
            limit: 10,
            order: [[Sequelize.literal('totalSold'), 'DESC']] // Order by totalSold descending
        });

        return successResponse(res, "Top selling items retrieved successfully", { topItems });
    } catch (error) {
        console.error(error);
        return errorResponse(res, error.message);
    }
};

/**
 * Create a new  menu item. (Only admins)
 * @method  POST
 * @param   {Object} req - The request object, which should include the item details in the request body.
 * @param   {Object} res - The response object used to send back the response.
 * @returns {Object} - A JSON response containing:
 * - `message`: Item created successfully
 * - `data`:
 *  - `item`: The new item retrieved from the database.
*/ 
exports.createItem= async (req, res) => {
    try {
        const { value, error } = addValidation(req.body);
        if (error) return failedResponse(res, error.details[0].message);
        const isExist = await Item.findOne({ where: { name: value.name } }); 
        if (isExist) return failedResponse(res, "Item name already exists");
        const category = await Category.findOne({
            where: { name: value.category }
        });
        if (!category) return failedResponse(res, "Category not found", null, 404);
        const item = await Item.create({
            ...value,
            categoryID: category.id,
        });
        
        return successResponse(res, "Item created successfully", { item });
    } catch (error) {
        console.log(error);
        return errorResponse(res, error.message);
    }
}
/**
 * Update an item by its ID. (Only admins)
 * @method  PUT
 * @param   {Object} req - The request object, which should include the item details in the request body.
 * @param   {Object} res - The response object used to send back the response.
 * @returns {Object} - A JSON response containing:
 * - `message`: Item updated successfully
 * - `data`:
 *  - `item`: The updated item retrieved from the database.
*/
exports.updateItem = async (req, res) => {
    try {
        const { itemID } = req.params;
        if (!itemID) return failedResponse(res, "Item ID is required");
        
        const item = await Item.findByPk(itemID);
        if (!item) return failedResponse(res, "Item not found", null, 404);
        const { value, error } = updateValidation(req.body); 
        if (error) return failedResponse(res, error.details[0].message);
        await Item.update({ ...value }, { where: { id: itemID } })
        const updatedItem = await Item.findByPk(itemID); 
        return successResponse(res, "Item updated successfully", { updatedItem });
    } catch (error) {
        console.log(error);
        return errorResponse(res, error.message);
    }
}
/**
 * Delete an item by its ID. (Only admins)
 * @method  DELETE
 * @param   {Object} req - The request object, which should include the item ID in the request params.
 * @param   {Object} res - The response object used to send back the response.
 * @returns {Object} - A JSON response containing:
 *  - `message`: Item deleted successfully
*/ 
exports.deleteItem= async (req, res) => {
    try {
            const itemID = req.params.itemID;
            if (!itemID) return failedResponse(res, "Item ID is required");

            const item = await Item.findByPk(itemID); // Find the item.
            if (!item) return failedResponse(res, "Item not found", null, 404);

            await item.destroy(); // Delete the item.
            return successResponse(res, "Item deleted successfully");

    } catch (error) {
        console.log(error);
        return errorResponse(res, error.message);
    };
};


