import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import logger from 'morgan';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';

const PORT = process.env.PORT || 3000;

// Configuring the database
import { databasePath } from './config/database.config.js';

mongoose.Promise = global.Promise;
mongoose
  .connect(databasePath.urlReal, { useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to the database');
  })
  .catch(err => {
    console.log(err);
    console.log('Could not connect to the database');
    process.exit();
  });

const app = express();

app.use(compression());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(fileUpload());
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.disable('etag');

// route
import { imageRoute } from './routes/image.route.js'
imageRoute(app);

import { userRoute } from './routes/user.route.js'
userRoute(app);

// listen on port
app.listen(PORT, err => {
  if (err) {
    console.log(err);
  }
  console.error(`Server listening on ${PORT}`);
});
