/**
 * Represents an User model.
 * This model defines the structure of the items table and their relationships.
 * 
 * @class User
 * @extends {Model}
 */

const {Model} = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
    /**
     * Initializes the User model with the sequelize instance and DataTypes.
     * 
     * @static
     * @param {Sequelize} sequelize - The Sequelize instance used for DB operations.
     * @param {DataTypes} DataTypes - The DataTypes used for defining column types.
     * @returns {Model} The initialized Item model.
     */
    static init(sequelize, DataTypes) {
        return super.init({
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            role: {
                type: DataTypes.ENUM('admin', 'staff'),
                defaultValue: 'staff'
            },
            passResetToken:{
                type: DataTypes.STRING,
                allowNull: true
            },
            passResetExpire:{
                type: DataTypes.DATE,
                allowNull: true
            },
        }, {
            sequelize, 
            modelName: 'users',
            hooks: {
                beforeSave: async (user) => {
                    if (user.password) {
                        user.password = await bcrypt.hash(user.password, 10);
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.password) {
                        user.password = await bcrypt.hash(user.password, 10);
                    }
                }
            } 
        });
    };
    /**
     * Sets up associations between the Item model and other models.
     * 
     * @static
     * @param   {Object} models - An object containing all the models in the Sequelize instance.
     * @returns {void}
     */
    
    static associate(models) {
        this.hasMany(models.Order,{
            foreignKey: 'id',
            as: 'orders'
        });
    };
    
    /**
     * returns the user details without the sensitive information.
     *  @returns {Object} - The user details without the sensitive information.
     * */
    toJSON() {
        const values = { ...this.get() };
        delete values.role;
        delete values.password; 
        delete values.passResetToken; 
        delete values.passResetExpire; 
        return values;
    }
};

module.exports = User;