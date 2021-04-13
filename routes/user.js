const express = require("express");
const User = require("../models/User");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

router.post("/user/signup", async (req, res) => {
    try {
        const { email, username, phone, password } = req.fields;
        const userExist = await User.findOne({ email: email });
        // console.log(userExist);
        console.log(username);
        if (!userExist && username) {
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
        } else if (userExist) {
            res.status(200).json("User already exists");
        } else if (!username) {
            res.status(200).json("Username wanted");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post("/user/login", async (req, res) => {
    try {
        const { email, password } = req.fields;
        const currentUser = await User.findOne({ email });
        let infoToClient = {};
        console.log(currentUser);
        // on va regarder si newhash correspond à celui enregistré
        const newHash = SHA256(currentUser.salt + password).toString(encBase64);

        if (newHash === currentUser.hash) {
            infoToClient = currentUser;
            console.log(infoToClient);
            console.log(delete infoToClient.email);
            delete infoToClient.token;
            delete infoToClient.hash;
            delete infoToClient.salt;
            console.log(infoToClient);
            res.status(200).json(infoToClient);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.all("*", (req, res) => {
    res.json("Bad getaway");
});

module.exports = router;
