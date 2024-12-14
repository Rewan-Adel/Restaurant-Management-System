const {Model} = require('sequelize');
/**
 * Represents an OrderItems model.
 * This model defines the structure of the items table and their relationships.
 * 
 * @class OrderItems
 * @extends {Model}
 */

class OrderItems extends Model{
    /**
     * Initializes the OrderItems model with the sequelize instance and DataTypes.
     * 
     * @static
     * @param {Sequelize} sequelize - The Sequelize instance used for DB operations.
     * @param {DataTypes} DataTypes - The DataTypes used for defining column types.
     * @returns {Model} The initialized Item model.
     */
    static init(sequelize, DataTypes){
        return super.init({
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            orderID:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'orders',
                    key: 'id'
                }
            },
            itemID:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'items',
                    key: 'id'
                }
            },
            quantity:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            price:{
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            }
        },{
            sequelize,
            timestamps: false,
            modelName: 'order_items'
        })
    };

    static associate(models) {
        this.belongsTo(models.Order, {
            as: 'order',
            foreignKey: 'orderID'  
        });

        this.belongsTo(models.Item, {
            as: 'item',
            foreignKey: 'itemID'  
        });
    }
};

module.exports = OrderItems;