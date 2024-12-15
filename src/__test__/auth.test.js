const request = require('supertest');
const {Sequelize, DataTypes} = require('sequelize');

const { User }= require('../config/Database');
const app = require('../app');

const sequelize = new Sequelize('sqlite:memory', {logging: false});
const userModel = User.init(sequelize, DataTypes);

const seedData = async () => {
    await userModel.create({
        username: 'test_user',
        email: 'testuser@gmail.com',
        password:  '123456password',
        role: 'admin',
        createdAt: '2024-01-01T12:00:00Z',
        updatedAt: '2024-01-01T12:00:00Z',
        passResetToken:null,
        passResetExpire:null
    });
};

beforeAll(async () => {
    await sequelize.sync({force: true});
    await seedData();
});

afterAll(async()=>{
    await sequelize.close();
});

describe('Registration', () => {
    it('should return username is required', async () => {
        const response = await request(app).post('/api/v1/auth/register').send({
            email: 'testuser@gmail.com',
            password: 'password'
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe("Username is required");
        expect(response.body.data).toBe(null);
    });
    it('should return username cannot be empty', async () => {
        const response = await request(app).post('/api/v1/auth/register').send({
            username: '',
            email: 'testuser@gmail.com',
            password: 'password'
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe("Username cannot be empty");
        expect(response.body.data).toBe(null);
    });
    it('should return email is required', async () => {
        const response = await request(app).post('/api/v1/auth/register').send({
            username: 'test_user',
            password: 'password'
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe("Email is required");
        expect(response.body.data).toBe(null);
    });
    it("should return invalid email format", async () => {
        const response = await request(app).post('/api/v1/auth/register').send({
            username: 'test_user',
            email: 'testuser',
            password: 'password'
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe("Invalid email format");
        expect(response.body.data).toBe(null);
    });
    it('should return password is required', async () => {
        const response = await request(app).post('/api/v1/auth/register').send({
            username: 'test_user',
            email: 'testuser@gmail.com'
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe("Password is required");
        expect(response.body.data).toBe(null);
    });
    it('should return password cannot be empty', async () => {
        const response = await request(app).post('/api/v1/auth/register').send({
            username: 'test_user',
            email: 'testuser@gmail.com'
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe("Password is required");
        expect(response.body.data).toBe(null);
    });
    it('should return password must contain both letters and numbers only', async () => {
        const response = await request(app).post('/api/v1/auth/register').send({
            username: 'test_user',
            email: 'testuser@gmail.com',
            password: '12345'
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe("Password must contain both letters and numbers only");
        expect(response.body.data).toBe(null);
    });
    it('should return password length must be at least 6 characters', async () => {
        const response = await request(app).post('/api/v1/auth/register').send({
            username: 'test_user',
            email: 'testuser@gmail.com',
            password:  '1234p'
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe("Password should have a minimum length of 6 characters");
        expect(response.body.data).toBe(null);
    
    });
    it('should return user already exists', async () => {
        const response = await request(app).post('/api/v1/auth/register').send({
            username: 'test_user',
            email: 'testuser@gmail.com',
            password:  '123456password'
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Email already exists');
        expect(response.body.data).toBe(null);
    });
    it('should return user registered successfully', async () => {
        const response = await request(app).post('/api/v1/auth/register').send({
            username: 'test_user1',
            email: 'test2@gmail.com',
            password:'123456password'
        });

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('User registered successfully');
        expect(response.body.data.token).toBeDefined();
        expect(response.body.data.token).toMatch(/^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/); // JWT token


        const user = response.body.data.user
        expect(user.id).toBe(2);
        expect(user.username).toBe('test_user1');
        expect(user.email).toBe('test2@gmail.com');
    });
});

describe('Login', () => {
    it('should return Invalid email or password with invalid email', async () => {
        const response = await request(app).post('/api/v1/auth/login').send({
            email: 'user@gmail.com',
            password: 'password'
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Invalid email or password');
        expect(response.body.data).toBe(null);
    });

    it('should return Invalid email or password with invalid password', async () => {
        const response = await request(app).post('/api/v1/auth/login').send({
            email: 'testuser@gmail.com',
            password:  '123456',
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Invalid email or password');
        expect(response.body.data).toBe(null);
    });

    it('should return User logged in successfully', async () => {
        const response = await request(app).post('/api/v1/auth/login').send({
            email: 'testuser@gmail.com',
            password:  '123456password',
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('User logged in successfully');
        expect(response.body.data.token).toBeDefined();
        expect(response.body.data.token).toMatch(/^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/); // JWT token

        const user = response.body.data.user
        expect(user.id).toBe(1);
        expect(user.username).toBe('test_user');
        expect(user.email).toBe('testuser@gmail.com');    
    });
});