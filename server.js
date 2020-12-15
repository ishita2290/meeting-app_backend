const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const User = require('./Models/User');

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

const DB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successfull");
  })
  .catch((error) => {
    console.log(`Cannot connect to database, error: ${error}`);
  });
app.get("/", (request, response) => {});

app.listen(4014, console.log("Server started"));
