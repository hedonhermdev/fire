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
const dataBlockTemplateRouter = require('./api/content/DataBlockTemplate')
const userRouter = require('./api/auth/User')
const fileUploadRouter = require('./api/fileupload/api')
const roleRouter = require('./api/auth/Role')

// IMPORT MIDDLEWARE
const authMiddleware = require('./middleware/auth');


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
app.use('/template', dataBlockTemplateRouter)
app.use('/user', userRouter)
app.use('/file', fileUploadRouter)
app.use('/role', roleRouter)

module.exports = app;
