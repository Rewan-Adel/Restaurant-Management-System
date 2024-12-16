const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const compression = require('compression');
require('dotenv').config();
const app = express();

const { failedResponse, successResponse, errorResponse } = require('./middlewares/response');
const { expireOrders } = require('./utils/backgroundJobs');

const menuRoute = require('./routes/menu.route');
const authRoute = require('./routes/auth.route');
const orderRoute = require('./routes/order.route');
const staffRoute = require('./routes/staff.route');

const whitelist = [];
const corsOptions = {
    origin: function (origin, callback) {
        if (!whitelist.includes(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization'
};
app.use(cors(corsOptions));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env.NODE_ENV === 'production'){
    app.use(compression());
};
app.use((err, req, res, next) => {
    if(err instanceof Error && err.message === 'Not allowed by CORS') {
        return failedResponse(res, err.message, null, 403);
    }else if(err instanceof Error){
        console.log(err);
        return errorResponse(res);
    }
    next();
});

app.get('/', (req, res) => {
    return successResponse(res, 'Welcome to Restaurant Management System API');
});

app.use('/api/v1/menu',  menuRoute);
app.use('/api/v1/auth',  authRoute);
app.use('/api/v1/order', orderRoute);
app.use('/api/v1/staff', staffRoute);

app.all('*', (req, res) => {
    return failedResponse(res, `Can't find ${req.originalUrl} on this server!`, null, 404);
});

expireOrders();

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
}).on('error', (error) => {
    console.log('Error starting server:', error.message);
});

module.exports = app;