const e = require('express');
const {User, Order, OrderItem, Item} = require('../config/Database');
const {failedResponse, successResponse, errorResponse} = require('../middlewares/response');
const orderNumGenerator = require('../utils/orderNumGenerator');
const pagination = require('../utils/pagination');
/**
 * Controller class for handling orders by staff and admin
 * @class OrderController
 * @exports OrderController 
 */
class OrderController{
    /**
     * Staff take an order from customers
     * @param {object} req : Request object , which should include the order details as a body.
     * @param {object} res  : Response object used to send back the response.
     * @returns - A JSON response containing:
     * -message: Order created successfully
     * -data:
     * -order: The order that was created.
     */
    async createOrder(req, res){
        try{
            const { id }    = req.user;            
            const { items } = req.body; 
            if(!items || items.length === 0){
                return failedResponse(res, "Items are required", null, 400);
            };

            let totalPrice    = 0;
            let itemsData     = [];
            let notFoundItems = [];

            //check if items exist or not
            for(const data of items){                
                const {itemID, quantity} = data;
                const item = await Item.findByPk(itemID);

                if(!item) 
                    notFoundItems.push(itemID);
                else{
                    itemsData.push({
                        id: itemID,
                        itemName:item.name,
                        quantity,
                        price: item.price * quantity * quantity
                    });
                    totalPrice += item.price * quantity;
                };
            };

            if(notFoundItems.length > 0){
                return failedResponse(res, `Items with id  ${notFoundItems.join(", ")} not found`, null, 404);
            };

            const orderNumber = orderNumGenerator();
            const order = await Order.create({
                userID: id,
                number: orderNumber,
                total : totalPrice
            });

            //create order items
            for(const item of itemsData){
                await OrderItem.create({
                    orderID : order.id,
                    itemID  : item.id,
                    quantity: item.quantity,
                    price   : item.price
                });
                
    
            };
            const orderData = await Order.findByPk(order.id,{
                include: [
                    {
                        model: User,
                        as: 'orderedBy',
                        attributes: ['id', 'username']
                    },  
                    {
                        model: Item,
                        as: 'items',
                        attributes: ['id', 'name', 'price'],
                        through: { attributes: ['price', 'quantity'] }
                    }
                ]
            });
            return successResponse(res, "Order created successfully", {
                order: orderData
            });
        }catch(error){
            console.log(error);
            return failedResponse(res, error.message);
        }
    };
    /**
    * 
    * Get all orders by a staff member
    * @param {object} req : Request object , which should include the query parameter `page`.
    * @param {object} res  : Response object used to send back the response.
    * @returns - A JSON response containing:
    * - `message`: Orders retrieved successfully
    * - `data`:
    * - `orders`: The orders retrieved from the database (paginated).
    * - `total` : The total number of orders in the database.
    * - `totalPages`: The total number of pages based on the limit.
    * - `currentPage`: The current page number.
    * */
    async getOrdersByStaff(req, res){
        const page = parseInt(req.query.page) || 1;    
        const {limit, offset} = pagination(page);
        try{
            console.log(req.user.id);
            
            const orders = await Order.findAndCountAll({
                limit,
                offset,
                where: {userID: req.user.id},
                attributes: {exclude: ['userID']},
                include:[
                    {
                        model: User,
                        as: 'orderedBy',
                        attributes: ['id', 'username']
                    },{
                        model: Item,
                        as: 'items',
                        attributes: ['id', 'name', 'price'],
                        through: { attributes: ['price', 'quantity'] }
                    }
                ]
            });

            return successResponse(res, "Orders retrieved successfully", {
                orders: orders.rows,
                total: orders.count,
                currentPage: page,
                totalPages: Math.ceil(orders.count / limit)
            })
        }catch(error){
            console.log(error);
            return errorResponse(res, error.message);
        };
    };
    /**
     * Get a single order by its ID by staff
     * @param {object} req : Request object , which should include the order ID as a parameter.
     * @param {object} res  : Response object used to send back the response.
     * @returns - A JSON response containing:
     * - `message`: Order retrieved successfully
     * - `data`:
     * - `order`: The order retrieved from the database.
     */
    async getOneOrderByStaff(req, res){
        const {orderID} = req.params;
        if(!orderID) return failedResponse(res, "Order ID is required", null, 400);
        try{
            const order = await Order.findByPk(orderID,{
                include: [
                    {
                        model: User,
                        as: 'orderedBy',
                        attributes: ['id', 'username'],
                    },{
                            model: Item,
                            as: 'items',
                            attributes: ['id', 'name', 'price'],
                            through: { attributes: ['price', 'quantity'] }
                    }
                ]
            });
            
            if(!order) return failedResponse(res, "Order not found", null, 404);
            if(order.userID !== req.user.id) 
                return failedResponse(res, "You are trying to access an order that doesn't belong to you", null, 401);
            
            return successResponse(res, "Order retrieved successfully", {order});
        }catch(error){
            console.log(error);
            return errorResponse(res, error.message);
        }
    };
    /**
     * Mark an order as completed by staff
     * @param {object} req : Request object , which should include the order ID as a parameter.
     * @param {object} res  : Response object used to send back the response.
     * @returns - A JSON response containing:
     * - `message`: Order marked as completed successfully
     * - `data`:
     * - `order`: The order that was marked.
     * */
    async markOrderAsCompleted(req, res){
        const {orderID} = req.params;
        if(!orderID) return failedResponse(res, "Order ID is required", null, 400);
        try{
            let order = await Order.findByPk(orderID,{
                include: [
                    {
                        model: User,
                        as: 'orderedBy',
                        attributes: ['id', 'username']
                    },  
                    {
                        model: Item,
                        as: 'items',
                        attributes: ['id', 'name', 'price'],
                        through: { attributes: ['price', 'quantity'] }
                    }
                    ]

            });
            
            if(!order) return failedResponse(res, "Order not found", null, 404);
            if(order.userID !== req.user.id) 
                return failedResponse(res, "You are trying to access an order that doesn't belong to you", null, 401);
            
            if(order.status === 'pending'){
                order.status = 'completed';
                await order.save();
                return successResponse(res, "Order marked as completed successfully", {order});
            }else{
                return failedResponse(res, `Can't mark because order is ${order.status}.`, null, 400);
            }
        }catch(error){
            console.log(error);
            return errorResponse(res, error.message);
        }
    };

    /**
     * Add items to an order
     * @param {object} req : Request object , which should include the order ID and item ID as a parameter.
     * @param {object} res  : Response object used to send back the response.
     * @returns - A JSON response containing:
     * - `message`: Items added to order successfully
     * - `data`:
     * - `order`: The order that was updated.
     * */
    async addItemsToOrder(req, res){
        const {orderID} = req.params;
        const {items}   = req.body;
        if(!orderID) return failedResponse(res, "Order ID is required", null, 400);
        if(!items || items.length === 0) return failedResponse(res, "Items are required", null, 400);

        try {
            const order = await Order.findByPk(orderID);
            if(!order) return failedResponse(res, "Order not found", null, 404);

            
            if(order.status !== "pending" && order.status !== 'completed') return failedResponse(res, `Order is ${order.status}. Can't add or remove more items.`, null, 400);
            
            let totalPrice    = parseFloat(order.total);
            let notFoundItems = [];
            let itemsData     = [];

            for(const data of items){
                const {itemID, quantity} = data;
                const item = await Item.findByPk(itemID);

                if(!item) notFoundItems.push(itemID);
                else{
                    itemsData.push({
                        id: itemID,
                        itemName: item.name,
                        quantity,
                        price: item.price * quantity
                    });
                    totalPrice += item.price * quantity;
                };
            };

            if(notFoundItems.length > 0){
                return failedResponse(res, `Items not found: ${notFoundItems.join(", ")}`, null, 404);
            };

            order.total = totalPrice;
            await order.save();

            for(const item of itemsData){
                const itemExists = await OrderItem.findOne({
                    where: {
                        orderID: orderID,
                        itemID: item.id
                    }
                });
                if(itemExists){
                    itemExists.quantity += item.quantity;
                    itemExists.price = parseFloat(itemExists.price) + parseFloat(item.price) *  item.quantity ;                     
                    await itemExists.save();
                }else{                    
                    await OrderItem.create({
                        orderID: orderID,
                        itemID  : item.id,
                        quantity: item.quantity,
                        price   : item.price * item.quantity
                    });
            }
            };

            const updatedOrder = await Order.findByPk(orderID,{
                include:[
                    {
                        model: Item,
                        as: 'items',
                        attributes: ['id', 'name', 'price'],
                        through: { attributes: ['price', 'quantity'] }
                    }
                ]
            });
            return successResponse(res, "Items added to order successfully", {
                order: updatedOrder
            });
        } catch (error) {
            console.log(error);
            return errorResponse(res, error.message);
        }
    };
    /**
     * Remove items from an order
     * @param {object} req : Request object , which should include the order ID and item ID as a parameter.
     * @param {object} res  : Response object used to send back the response.
     * @returns - A JSON response containing:
     * - `message`: Items removed from order successfully
     * - `data`:
     * - `order`: The order that was updated.
     * */
    async removeItemsFromOrder(req, res){
        const {orderID} = req.params;
        const {items}   = req.body;
        if(!orderID) return failedResponse(res, "Order ID is required", null, 400);
        if(!items || items.length === 0) return failedResponse(res, "Items are required", null, 400);

        try {
            const order = await Order.findByPk(orderID);
            if(!order) return failedResponse(res, "Order not found", null, 404);
            
            if(order.status !== "pending" && order.status !== 'completed') return failedResponse(res, `Order is ${order.status}. Can't add or remove more items.`, null, 400);

            let totalPrice    = parseFloat(order.total);
            let notFoundItems = [];
            let itemsData     = [];
            let orderItem;

            for(const data of items){
                const {itemID, quantity} = data;
                const item = await Item.findByPk(itemID);
                orderItem = await OrderItem.findOne({
                    where: {
                        orderID: orderID,
                        itemID: itemID
                    }
                })
                if(!item || !orderItem) notFoundItems.push(itemID);
                else{
                    const itemPrice = parseFloat(item.price) * quantity;
                    itemsData.push({
                        id: itemID,
                        itemName: item.name,
                        quantity,
                        price: itemPrice
                    });
                    totalPrice -= itemPrice;
                };
            };

            if(notFoundItems.length > 0){
                return failedResponse(res, `Items not found: ${notFoundItems.join(", ")}`, null, 404);
            };

            order.total = totalPrice;
            await order.save();

            for(const item of itemsData){
                if(orderItem.quantity < item.quantity || orderItem.quantity === item.quantity){
                    await orderItem.destroy();
                }else{
                    const itemPrice = parseFloat(item.price) * item.quantity;
                    
                    orderItem.quantity -= item.quantity;
                    orderItem.price = parseFloat(orderItem.price) - itemPrice ;                     
                    await orderItem.save();
                };
            };

            const updatedOrder = await Order.findByPk(orderID,{
                include:[
                    {
                        model: Item,
                        as: 'items',
                        attributes: ['id', 'name', 'price'],
                        through: { attributes: ['price', 'quantity'] }
                    }
                ]
            });
            return successResponse(res, "Items removed from order successfully", {order: updatedOrder});
        } catch (error) {
            return errorResponse(res, error.message);
        }
    };

    //Only Admin Operations
    /**
     * Update an order status to either pending, completed or cancelled
     * @param {object} req : Request object , which should include the order ID as a parameter.
     * @param {object} res  : Response object used to send back the response.
     * @returns - A JSON response containing:
     * - `message`: Order marked successfully
     * - `data`:
     * - `order`: The order that was marked.
     * */
    async changeOrderStatus(req, res){
            const {orderID} = req.params;
            const {status}  = req.body;
            if(!orderID) return failedResponse(res, "Order ID is required", null, 400);
    
            try{
                let order = await Order.findByPk(orderID);
                if(!order) return failedResponse(res, "Order not found", null, 404);

                if(!status) return failedResponse(res, "Status is required", null, 400);
                if(status !== 'pending' && status !== 'completed' && status !== 'cancelled'){
                    return failedResponse(res, "Invalid status. Status can only be pending, completed or cancelled", null, 400);
                };

                order.status = status;
                await order.save();
                
                const updatedOrder = await Order.findByPk(orderID);
                return successResponse(res, "Order marked successfully", {order: updatedOrder});
            }catch(error){
                console.log(error);
                return errorResponse(res, error.message);
            };
    };

    /**
     * Delete an order by its ID
     * @param {object} req : Request object , which should include the order ID as a parameter.
     * @param {object} res  : Response object used to send back the response.
     * @returns - A JSON response containing:
     * - `message`: Order deleted successfully
     * */
    async deleteOrder(req, res){
        const {orderID} = req.params;
        if(!orderID) return failedResponse(res, "Order ID is required", null, 400);
        try{
            const order = await Order.findByPk(orderID);
            if(!order) return failedResponse(res, "Order not found", null, 404);

            await OrderItem.destroy({ where: { orderID } });
            await order.destroy();
            return successResponse(res, "Order deleted successfully");
        }catch(error){
            console.log(error);
            return errorResponse(res, error.message);
        }
    };
    /**
     * Get a single order by its ID for admin
     * @param {object} req : Request object , which should include the order ID as a parameter.
     * @param {object} res  : Response object used to send back the response.
     * @returns - A JSON response containing:
     * - `message`: Order retrieved successfully
     * - `data`:
     * - `order`: The order retrieved from the database.
     * */
    async getOneOrder(req, res){
        const {orderID} = req.params;
        if(!orderID) return failedResponse(res, "Order ID is required", null, 400);
        try{
            const order = await Order.findByPk(orderID,{
                attributes: {exclude: ['userID']},
                include: [
                    {
                        model: User,
                        as: 'orderedBy',
                        attributes: ['id', 'username']
                    },{
                        model: Item,
                        as: 'items',
                        attributes: ['id', 'name', 'price'],
                        through: { attributes: ['price', 'quantity']
                        }
                    }
                ]
                });
            if(!order) return failedResponse(res, "Order not found", null, 404);
            return successResponse(res, "Order retrieved successfully", {order});
        }catch(error){
            console.log(error);
            return errorResponse(res, error.message);
        };
    };
    /**
     * Get all orders with optional status filter , any status can be passed as a query parameter
     * @param {object} req : Request object , which should include the query parameter `page`. status query is optional
     * @param {object} res  : Response object used to send back the response.
     * @returns - A JSON response containing:
     * - `message`: Orders retrieved successfully
     * - `data`:
     * - `orders`: The orders retrieved from the database (paginated).
     * - `total` : The total number of orders in the database.
     * - `totalPages`: The total number of pages based on the limit.
     * - `currentPage`: The current page number.
     * */
    async getAllOrders(req, res){
            const page = parseInt(req.query.page) || 1;    
            const {limit, offset} = pagination(page);
            const {status} = req.query || '';
            try{
                const orderCount = await Order.count({
                    where: status ? { status } : {}
                });

                const orders = await Order.findAndCountAll({
                    limit,
                    offset,
                    where: status ? {status} : {},
                    include: [
                        {
                        model: User,
                        as: 'orderedBy',
                        attributes: ['id', 'username']
                        },{
                        model: Item,
                        as: 'items',
                        attributes: ['id', 'name', 'price'],
                        through: { attributes: ['price', 'quantity'] }
                        }
                    ]
                });
    
                return successResponse(res, "Orders retrieved successfully", {
                    orders: orders.rows,
                    total: orderCount,
                    currentPage: page,
                    totalPages: Math.ceil(orderCount / limit)
                })
            }catch(error){
                console.log(error);
                return errorResponse(res, error.message);
            };
    };
};

module.exports = new OrderController();