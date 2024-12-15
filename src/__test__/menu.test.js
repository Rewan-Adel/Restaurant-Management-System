const request = require('supertest');
const { Sequelize, DataTypes } = require('sequelize');
const app = require('../app');
const { Item, Category } = require('../config/Database');

const sequelize = new Sequelize('sqlite:memory', { logging: false });
const itemModel = Item.init(sequelize, DataTypes);
const categoryModel = Category.init(sequelize, DataTypes);

Category.hasMany(Item, { foreignKey: 'categoryID', as: 'items' });
Item.belongsTo(Category, { foreignKey: 'id', as: 'category' });

const seedData = async () => {
    const category = await categoryModel.create({
        name: 'Burgers',
        createdAt: new Date('2024-01-01T12:00:00Z'),
        updatedAt: new Date('2024-01-01T12:00:00Z'),
    });

    await itemModel.create({
        name: 'Cheeseburger',
        description: 'Delicious beef burger with cheese',
        price: 10.99,
        categoryID: category.id,
        createdAt: '2024-01-01T12:00:00Z',
        updatedAt: '2024-01-01T12:00:00Z'
    });
};

beforeAll(async () => {
    await sequelize.sync({ force: true });
    await seedData();
});

afterAll(async () => {
    await sequelize.close();
});

describe('Menu APIs', () => {
    it('should return 404 for not found item', async () => {
        const response = await request(app).get('/api/v1/menu/item/100');
        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Item not found');
        expect(response.body.data).toBe(null);
    });

    it('should return a single item', async () => {
        const response = await request(app).get('/api/v1/menu/item/1');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Item retrieved successfully');

        const item = response.body.data.item;
        expect(item.id).toBe(1);
        expect(item.name).toBe('Cheeseburger');
        expect(item.description).toBe('Delicious beef burger with cheese');
        expect(item.price).toBe(10.99);
        expect(item.category.id).toBe(1);
        expect(item.category.name).toBe('Burgers');
    });

    it('should return all items', async () => {
        const response = await request(app).get('/api/v1/menu/');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Items retrieved successfully');

        const items = response.body.data.items;
        expect(items.length).toBe(1);
        expect(response.body.data.total).toBe(1);
        expect(response.body.data.totalPages).toBe(1);
        expect(response.body.data.currentPage).toBe(1);

        expect(items[0].id).toBe(1);
        expect(items[0].name).toBe('Cheeseburger');
        expect(items[0].description).toBe('Delicious beef burger with cheese');
        expect(items[0].price).toBe(10.99);
        expect(items[0].category.id).toBe(1);
        expect(items[0].category.name).toBe('Burgers');
    });

    it('should return an empty list if no items exist', async () => {
        await sequelize.sync({ force: true });

        const response = await request(app).get('/api/v1/menu/');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Items retrieved successfully');

        expect(response.body.data.items.length).toBe(0);
        expect(response.body.data.total).toBe(0);
        expect(response.body.data.totalPages).toBe(0);
        expect(response.body.data.currentPage).toBe(1);
    });
});
