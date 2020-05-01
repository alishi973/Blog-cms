require('dotenv').config();
const express = require('express');
const app = express();
const graphQLHttp = require('express-graphql');
const mongoose = require('mongoose');
const { corsMiddleware } = require('./middlewares');

app.disable('x-powered-by');

//Allow Cross Site Origin Resource Sharing
app.use(corsMiddleware);

mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(app.listen(process.env.PORT || 1234, console.log(`Started at Port ${process.env.PORT || 1234}`)))
  .catch(console.error);

app.get(/\/__graphql/, (req, res) => res.sendStatus(403));

app.use(/\/__graphql/, (req, res, next) => {
  res.send('ok');
});
