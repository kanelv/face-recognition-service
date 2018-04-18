const express = require('express');
const logger = require('morgan');

// Configuring the database
const dbConfig = require('./config/database.config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url)
.then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log("Could not connect to the database");
    process.exit();
});

const app = express();
app.use(logger('dev'));

require('./routes/image.route')(app);
app.listen('3000', err => {
    console.error("Server listening on localhost:3000");
});