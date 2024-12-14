const { Sequelize } = require('sequelize');
const User      = require('../models/user.model');
const Category  = require('../models/category.model');
const Item      = require('../models/item.model');
const Order     = require('../models/order.model');
const OrderItem = require('../models/order_items.model');

/**
 * Database singleton class to handle database connection and model synchronization.
 * Ensures that only one instance of the database connection is created.
 * 
 * @class Database
 */
class Database {
    /**
     * Singleton instance of the Database class.
     * @static
     * @memberof Database
     */
    static instance;

    /**
     * Creates an instance of the Database class.
     * Initializes Sequelize, connects to the database, synchronizes models, and applies associations.
     * If an instance already exists, it returns the existing one.
     * 
     * @memberof Database
     */
    constructor() {
        if (Database.instance) return Database.instance;

        this.sequelize = new Sequelize({
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
            dialect: 'mysql',
            logging: false
        });

        this.connect();
        this.dbSync();
        this.initModels();
        this.applyAssociations();
        Database.instance = this;
    };

    /**
     * Connects to the database and logs the connection status.
     * 
     * @async
     * @memberof Database
     * @returns {Promise<void>}
     */
    async connect() {
        try {
            await this.sequelize.authenticate();
            console.log('Database connected successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    };

    /**
     * Synchronizes the models with the database.
     * This will alter the tables to match the models, if necessary.
     * 
     * @async
     * @memberof Database
     * @returns {Promise<void>}
     */
    async dbSync() {
        try {
            await this.sequelize.sync({ alter: true });
            console.log('Synchronized.');
        } catch (error) {
            console.error('Unable to synchronize the database:', error);
        }
    };

    /**
     * Initializes the models and stores them in the `models` object.
     * This allows the models to be accessed from anywhere in the application.
     * 
     * @memberof Database
     */
    initModels() {
        this.models = {
            User     : User.init(this.sequelize, Sequelize),
            Order    : Order.init(this.sequelize, Sequelize),
            Item     : Item.init(this.sequelize, Sequelize),
            Category : Category.init(this.sequelize, Sequelize),
            OrderItem: OrderItem.init(this.sequelize, Sequelize)
        };
    };

    /**
     * Applies the associations between models by calling the `associate` method
     * on each model if it exists.
     * 
     * @memberof Database
     */
    applyAssociations() {
        Object.keys(this.models).forEach(modelName => {
            if (this.models[modelName].associate) {
                this.models[modelName].associate(this.models);
            }
        });
    }
};

const database = new Database();
module.exports = database.models;
