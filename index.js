// VAR ENV
require("dotenv").config();

// EXPRESS & FORMIDABLE
const express = require("express");
const formidable = require("express-formidable");
const app = express();
app.use(formidable());

// MONGOOSE
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

// CLOUDINARY
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// CORS
const cors = require("cors");
app.use(cors());

// ROUTES
const userRoutes = require("./routes/user");
app.use(userRoutes);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

app.all("*", (req, res) => {
    res.json("Bad getaway");
});

// PORTS
app.listen(proecss.env.PORT, () => {
    console.log("Server started");
});
