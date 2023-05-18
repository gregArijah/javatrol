const express = require('express');
const path = require('path');
const db = require('./config/connection');

//API routes
const routes = require('./routes');

//Initialize app and port for server
const PORT = process.env.PORT || 3001;
const app = express();

//Middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Serve static assets in production 
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

//Use API routes
app.use(routes);

//Start server and connect to MongoDB
db.once('open', () => {
  app.listen(PORT, () => console.log(`Now listening on localhost: ${PORT}`));
});