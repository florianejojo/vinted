const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/vinted", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const app = express();
app.use(formidable());

const userRoutes = require("./routes/user");
app.use(userRoutes);

app.listen(3000, () => {
    console.log("Server started");
});
