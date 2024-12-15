const {Model} = require('sequelize');
/**
 * Represents an Order model.
 * This model defines the structure of the items table and their relationships.
 * 
 * @class Order
 * @extends {Model}
 */

class Order extends Model{
     /**
     * Initializes the Order model with the sequelize instance and DataTypes.
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
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            userID:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            total:{
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            status:{
                type: DataTypes.ENUM('pending', 'completed','cancelled' ,'expired'),
                allowNull: false,
                defaultValue: 'pending'
            },
            number:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            createdAt:{
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt:{
                type: DataTypes.DATE,
                allowNull: false
            }
        },{
            sequelize,
            modelName: 'Order'
        })
    };
    /**
     * Sets up associations between the Item model and other models.
     * 
     * @static
     * @param   {Object} models - An object containing all the models in the Sequelize instance.
     * @returns {void}
     */
    static associate(models){
        this.belongsTo(models.User, {
            as: 'orderedBy',
            foreignKey: 'userID'
        });

        this.belongsToMany(models.Item, {
            through: 'order_items', 
            as: 'items',
            foreignKey: 'orderID'
        });
    };
};

module.exports = Order;