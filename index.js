require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Config = require("./models/config");
const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());

//MongoDB verbinding
mongoose
    .connect(process.env.MONGODB_URI, {useNewUrlParser: true })
    .then(() => { console.log("MongoDB verbonden"); })
    .catch((err) => { console.error("MongoDB verbindingsfout:", err); });

