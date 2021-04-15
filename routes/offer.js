// EXPRESS
const express = require("express");

//MONGOOSE
const mongoose = require("mongoose");

// CLOUDINARY
const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//     cloud_name: "ddpnheodb",
//     api_key: "134252468392595",
//     api_secret: "a0TJ_cfs-11BhSmH2KKZc3J4X3w",
// });

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

            owner: req.user,
        });

        const imageData = await cloudinary.uploader.upload(
            req.files.picture.path,
            {
                folder: `/vinted/offer/${newOffer._id}`,
            }
        );
        newOffer.product_image = { secure_url: imageData.secure_url };
        await newOffer.save();

        res.status(200).json(newOffer);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

router.get("/offers", async (req, res) => {
    try {
        let { title, priceMin, priceMax, sort, page } = req.query;

        let obj = {};
        let results = [];
        let asc_desc;
        let limit = 2;

        if (title) {
            obj.product_name = new RegExp(title, "i");
        }
        if (priceMax || priceMin) {
            if (!priceMax) priceMax = Infinity;
            if (!priceMin) priceMin = 0;
            obj.product_price = { $gte: priceMin, $lte: priceMax };
        }
        if (!page) {
            page = 1;
        }
        if (sort === "price-desc" || sort === "price-asc") {
            if (sort === "price-desc") asc_desc = -1;
            if (sort === "price-asc") asc_desc = 1;
            results = await Offer.find(obj)
                .sort({
                    product_price: asc_desc,
                })
                .skip(page * limit - limit)
                .limit(limit);
        } else {
            results = await Offer.find(obj)
                .skip(page * limit - limit)
                .limit(limit);
        }
        res.status(200).json(results);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

router.get("/offer/:id", async (req, res) => {
    try {
        const offerToDisplay = await Offer.findById(req.params.id);
        offerToDisplay.owner = await User.findById(offerToDisplay.owner).select(
            "account"
        );

        res.status(200).json(offerToDisplay);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports = router;
