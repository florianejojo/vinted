const express = require("express");
const router = express.Router();

router.post("/user/signup", (req, res) => {
    res.json("/user/signup");
});

router.post("/user/login", (req, res) => {
    res.json("/user/login");
});

router.all("*", (req, res) => {
    res.json("Bad getaway");
});

router.listen(3000, () => {
    res.json("server started");
});
