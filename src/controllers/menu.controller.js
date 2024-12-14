const { Op } = require('sequelize');
const  { Item, Category, Order } = require('../config/Database');
const pagination = require('../utils/pagination');

const { successResponse,
        failedResponse,  
        errorResponse
    } = require('../middlewares/response');

const {addValidation,
    updateValidation
} = require('../validation/item.validation');

/**
 * Controller class for handling menu items.
 * @class MenuController
 * @exports MenuController
 */
class MenuController {
    /**
     * Retrieve all items with pagination.
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
    async getAllItems(req, res) {
        const page = parseInt(req.query.page) || 1;    
        const {limit, offset} = pagination(page);                    
        try {
            const items = await Item.findAndCountAll({
                limit,
                offset,
                order: [['createdAt', 'DESC']],
                attributes: { exclude: ['categoryID'] },
                include:[
                    {model: Category, as : 'category' } 
                ]
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
    async getOneItem(req, res) {
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
    }

    /**
     * Retrieve a single item by its ID.
     * @method  GET
     * @param   {Object} req - The request object, which should include the query parameter `page`, `category`, and `priceOrder`.
     * @param   {Object} res - The response object used to send back the response.
     * @returns {Object} - A JSON response containing:
     * - `message`: Items retrieved successfully
     * - `data`:
     *  - `items`: The items retrieved from the database (paginated).
     *  - `totalItems`: The total number of items in the database.
     *  - `totalPages`: The total number of pages based on the limit.
     *  - `currentPage`: The current page number.
    */ 
    async filtration(req, res) {
        const page = parseInt(req.query.page) || 1;    
        const {limit, offset} = pagination(page);
        const category   = req.query.category   || ''; 
        const priceOrder = req.query.priceOrder || 'ASC'; 

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
                order: [['price', priceOrder]] 
            });

            return successResponse(res, "Items retrieved successfully", {
                items: items.rows,
                totalItems: items.count,
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
     * @method  POST
     * @param   {Object} req - The request object, which should include the item details in the request body.
     * @param   {Object} res - The response object used to send back the response.
     * @returns {Object} - A JSON response containing:
     * - `message`: Item created successfully
     * - `data`:
     *  - `item`: The new item retrieved from the database.
    */ 
    async createItem(req, res) {
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
     * Retrieve a single item by its ID.
     * @method  PUT
     * @param   {Object} req - The request object, which should include the item details in the request body.
     * @param   {Object} res - The response object used to send back the response.
     * @returns {Object} - A JSON response containing:
     * - `message`: Item updated successfully
     * - `data`:
     *  - `item`: The updated item retrieved from the database.
    */
    async updateItem(req, res) {
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
     * Retrieve a single item by its ID.
     * @method  DELETE
     * @param   {Object} req - The request object, which should include the item ID in the request params.
     * @param   {Object} res - The response object used to send back the response.
     * @returns {Object} - A JSON response containing:
     *  - `message`: Item deleted successfully
    */ 
    async deleteItem(req, res) {
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
        }
    }

};

module.exports = new MenuController();
