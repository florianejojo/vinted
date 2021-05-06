// EXPRESS
const express = require("express");

// CLOUDINARY
const cloudinary = require("cloudinary").v2;

// MODELS
const Offer = require("../models/Offer");
const User = require("../models/User");

// AUTH
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// ROUTER
const router = express.Router();

// ROUTES
router.post("/user/signup", async (req, res) => {
    // body envoyé = {
    //     "email": "floriane@coucou.fr",
    //     "username": "CoucouFloflo",
    //     "phone": "063678216893",
    //     "password": "coucou"
    //     "avatar" : {photo}
    //   }

    try {
        const { email, username, phone, password } = req.fields;
        const userExist = await User.findOne({ email: email });

        if (!userExist && username && password) {
            const salt = uid2(16);
            const hash = SHA256(salt + password).toString(encBase64);
            const token = uid2(64);
            const newUser = new User({
                email,
                account: {
                    username,
                    phone,
                    avatar: {},
                },
                token,
                hash,
                salt,
            });
            console.log();

            if (req.files.avatar) {
                const avatar = await cloudinary.uploader.upload(
                    req.files.avatar.path,
                    {
                        folder: `/vinted/user/${newUser._id}`,
                    }
                );
                newUser.account.avatar = avatar;
            }

            await newUser.save();
            // console.log(newUser);
            res.status(200).json("User added ");
        } else if (userExist) {
            res.status(200).json("User already exists");
        } else if (!username || !password) {
            res.status(200).json("Username or password missing");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post("/user/login", async (req, res) => {
    // body envoyé =
    //     {
    //         "email": "brice@lereacteur.io",
    //         "password": "azerty"
    //       }

    try {
        const { email, password } = req.fields;
        const currentUser = await User.findOne({ email });

        const newHash = SHA256(currentUser.salt + password).toString(encBase64);

        if (newHash === currentUser.hash) {
            res.status(200).json({
                id: currentUser.id,
                token: currentUser.token,
                account: {
                    username: currentUser.account.username,
                    phone: currentUser.account.phone,
                },
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
