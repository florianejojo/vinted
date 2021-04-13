const express = require("express");
const User = require("../models/User");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

router.post("/user/signup", async (req, res) => {
    try {
        const { email, username, phone, password } = req.fields;
        const salt = uid2(16);
        const hash = SHA256(salt + password).toString(encBase64);
        const token = uid2(64);
        const newUser = new User({
            email: email,
            account: {
                username: username,
                phone: phone,
                avatar: {},
            },
            token: token,
            hash: hash,
            salt: salt,
        });

        await newUser.save();
        res.status(200).json("User added ");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post("/user/login", (req, res) => {
    res.json("/user/login");
});

router.all("*", (req, res) => {
    res.json("Bad getaway");
});

module.exports = router;
