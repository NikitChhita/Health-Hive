require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/user-routes');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/users', usersRoutes);

const url = process.env.MONGO_URL;

mongoose.connect(url, {
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  const port = process.env.PORT || 5001;
  app.listen(port, () => {
    console.log(`Connected to MongoDB on port ${port}`);
  });
})
.catch(err => { 
  console.error("MongoDB connection error:", err);
});