/**
 * Represents an Category model.
 * This model defines the structure of the items table and their relationships.
 * 
 * @class Category
 * @extends {Model}
 */

const {Model} = require('sequelize');

class Category extends Model{
    /**
     * Initializes the Category model with the sequelize instance and DataTypes.
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
            }
        },{
            sequelize,
            timestamps: false,
            modelName: 'categories'
        })
    };
};

module.exports = Category;