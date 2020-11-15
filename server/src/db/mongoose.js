const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/fire", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    // autoReconnect: true,
    useUnifiedTopology: true
});
