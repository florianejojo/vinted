// EXPRESS
const express = require("express");

//MONGOOSE
const mongoose = require("mongoose");

// CLOUDINARY
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "ddpnheodb",
    api_key: "134252468392595",
    api_secret: "a0TJ_cfs-11BhSmH2KKZc3J4X3w",
});

// MODELS
const Offer = require("../models/Offer");
const User = require("../models/User");
// CHECK AUTH
const isAuthenticated = require("../middlewares/isAuthenticated");

// ROUTER
const router = express.Router();

// ROUTES
router.post("/offer/publish", isAuthenticated, async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            condition,
            city,
            brand,
            size,
            color,
        } = req.fields;
        // let pictureToUpload = req.files.picture.path;
        const imageData = await cloudinary.uploader.upload(
            req.files.picture.path
        );
        // const surl = imageData.secure_url;
        // console.log(imageData.secure_url);
        // const user = await User.findById(req.user.id).populate("User");

        // user.avatar = {};
        // user.avatar.secure_url = imageData.secure_url;
        // console.log(user);

        const newOffer = new Offer({
            product_name: title,
            product_description: description,
            product_price: price,
            product_details: [
                { MARQUE: brand },
                { TAILLE: size },
                { ETAT: condition },
                { COULEUR: color },
                { EMPLACEMENT: city },
            ],
            product_image: { secure_url: imageData.secure_url },
            owner: {
                account: {
                    username: req.user.username,
                    phone: req.user.phone,
                    avatar: { secure_url: imageData.secure_url },
                },
            },
        });
        // ne fonctionne pas car dans le model c'est déclaré différament snif

        res.status(200).json(newOffer);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports = router;
