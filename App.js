require('dotenv').config();
const express = require('express');
const app = express();
const graphQLHttp = require('express-graphql');
const mongoose = require('mongoose');

const { corsMiddleware } = require('./middlewares');
const graphiqlSchema = require('./graphql/schema');
const graphiqlResolver = require('./graphql/resolver');

app.disable('x-powered-by');

//Allow Cross Site Origin Resource Sharing
app.use(corsMiddleware);

app.get(/\/__graphql/, (req, res) => res.sendStatus(403));

app.use(
  /\/__graphql/,
  graphQLHttp({
    schema: graphiqlSchema,
    rootValue: graphiqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  }),
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(app.listen(process.env.PORT || 1234, console.log(`Started at Port ${process.env.PORT || 1234}`)))
  .catch(console.error);
