const corn    = require('node-cron');
const {Order} = require('../config/Database');
const { Op }  = require('sequelize');

/**
 * A function that checks for expired orders every hour. 
 * If an order has been pending for more than 4 hours, it is marked as expired.
 * @returns {void}
 */
exports.expireOrders = () => {
    console.log('Checking for expired orders...');

    corn.schedule('0 * * * *', async() => {
        const expirationAt = new Date(Date.now() - 4 * 60 *  60 * 1000); 
        await Order.update({
            status: 'expired'
        },{
            where:{
                status : 'pending',
                createdAt: {
                    [Op.lte]: expirationAt
                }
            }
        });

        console.log('Expired orders have been marked as expired');
    });
};