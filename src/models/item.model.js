/**
 * Represents an Item model.
 * This model defines the structure of the items table and their relationships.
 * 
 * @class Item
 * @extends {Model} 
 */

const {Model} = require('sequelize');

class Item extends Model{
    /**
     * Initializes the Item model with the sequelize instance and DataTypes.
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
            name:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            description:{
                type: DataTypes.STRING,
                allowNull: false
            },
            price:{
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            categoryID:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'categories',
                    key: 'id'
                }
            }
        },{
            sequelize,
            timestamps: true,
            modelName: 'items'
        })
    };

    /**
     * Sets up associations between the Item model and other models.
     * 
     * @static
     * @param {Object} models - An object containing all the models in the Sequelize instance.
     * @returns {void}
     */
    static associate(models){
        this.belongsTo(models.Category, {
            as: 'category',
            foreignKey: 'categoryID'    
        });

        this.belongsToMany(models.Order, {
            through: 'order_items',
            as: 'orders',
            foreignKey: 'itemID'    
        });
    };
};

module.exports = Item;