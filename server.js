const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const User = require("./Models/UserModel");
const UserRouter = require("./routes/User");
const router = require("./routes/dashboard")
const eventRoutes = require('./routes/events');
const cookieParser = require("cookie-parser");
const passport = require("passport");
const {jwtStrategy} = require ("./config/passportStrategies")
const cors = require("cors");

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(cors());
dotenv.config();
app.use(passport.initialize());
passport.use(jwtStrategy);

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

app.use('/user',UserRouter);
// app.use("/dashboard",router);
app.use('/events', eventRoutes);

app.listen(4014, console.log("Server started"));
