// EXPRESS & FORMIDABLE
const express = require("express");
const formidable = require("express-formidable");
const app = express();
app.use(formidable());

// MONGOOSE
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/vinted", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

// CLOUDINARY
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "ddpnheodb",
    api_key: "134252468392595",
    api_secret: "a0TJ_cfs-11BhSmH2KKZc3J4X3w",
});

// ROUTES
const userRoutes = require("./routes/user");
app.use(userRoutes);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

app.all("*", (req, res) => {
    res.json("Bad getaway");
});

// PORTS
app.listen(3000, () => {
    console.log("Server started");
});
