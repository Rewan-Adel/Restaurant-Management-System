const createCsvWriter  = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: 'report.csv',
    header: [
        {id: 'orderID',      title: 'Order ID'},
        {id: 'number',       title: 'Order Number'},
        {id: 'total',        title: 'Total Price'},
        {id:'itemsQuantity', title: 'Total Quantity'},
        {id: 'status',       title: 'Order Status'},
        {id: 'createdAt',    title: 'Created At'},
        {id: 'orderedBy',    title: 'Ordered By'},
    ]
});

module.exports = async(orders) => {
    try{
        const records = orders.map(order => {
            return {
                orderID: order.id,
                number: order.number,
                total: order.total,
                itemsQuantity: order._previousDataValues.itemsQuantity,
                status: order.status,
                createdAt: order.createdAt.toISOString().split('T')[0],
                orderedBy: order.orderedBy.username
            };
        });
    
        csvWriter.writeRecords(records)
            .then(() => console.log('The CSV file was written successfully'));
    }catch(err){
        console.log(err);
    }

};