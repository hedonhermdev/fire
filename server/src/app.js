// index.js creates the express server and runs it.
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// OPEN DATABASE CONNECTION
require('./db/mongoose');

// IMPORT ROUTERS
const pageRouter = require('./api/content/Page')
const pageGroupRouter = require('./api/content/PageGroup')
const dataBlockRouter = require('./api/content/DataBlock')
const userRouter = require('./api/auth/User')


// SETUP LOGGING MIDDLEWARE
const loggerMiddleware = (req, res, next) => {
    console.log(req.method + ' ' + req.path);
    next();
}

// SETUP REQUEST-PARSING MIDDLEWARE
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(loggerMiddleware);

app.use('/page', pageRouter)
app.use('/pageGroup', pageGroupRouter)
app.use('/dataBlock', dataBlockRouter)
app.use('/user', userRouter)

module.exports = app;