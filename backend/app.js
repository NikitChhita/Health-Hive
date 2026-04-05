import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import usersRoutes from './routes/user-routes.js';
import analyzeRouter from './routes/analyze.js';

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

app.use("/api/analyze", analyzeRouter);
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