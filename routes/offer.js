// EXPRESS
const express = require("express");

// CLOUDINARY
const cloudinary = require("cloudinary").v2;

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
        // newOffer.product_image = { secure_url: imageData.secure_url };
        newOffer.product_image = imageData;
        await newOffer.save();

        res.status(200).json(newOffer);
        // renvoyer qye secure_url dans imagedata
    } catch (error) {
        res.status(400).json(error.message);
    }
});

router.get("/offers", async (req, res) => {
    try {
        let { title, priceMin, priceMax, sort, page } = req.query;
        let obj = {};
        let obj_sort = {};
        let results = [];
        let asc_desc;
        let limit = Infinity;
        let count;

        if (title) {
            console.log("ici");
            obj.product_name = new RegExp(title, "i");
        }
        if (priceMax || priceMin) {
            if (!priceMax) priceMax = Infinity;
            if (!priceMin) priceMin = 0;
            obj.product_price = {
                $gte: Number(priceMin),
                $lte: Number(priceMax),
            };
        }
        if (!page) {
            page = 1;
        }
        if (sort === "price-desc" || sort === "price-asc") {
            if (sort === "price-desc") asc_desc = -1;
            else if (sort === "price-asc") asc_desc = 1;
            obj_sort.product_price = asc_desc;
        }
        // console.log(obj);
        results = await Offer.find(obj)
            .sort(obj_sort)
            .skip(Number(page) * limit - limit)
            .limit(limit)
            .populate("owner", "account");

        count = await Offer.countDocuments(results);

        res.status(200).json(results);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

router.put("/offer/update", async (req, res) => {
    // body envoyé = {
    // "id": "6079cdeb0eec8719e4cd85df",
    // "keyToModify": String, ("product_price" par exemple)
    // "newData" : Number or String (30 pour le price par exemple)
    // }
    // voir comment updtae la photo : la supprimer puis re-upload

    try {
        const offer = await Offer.findById(req.fields.id);
        if (offer) {
            offer[req.fields.keyToModify] = req.fields.newData;
            await offer.save();
            res.status(200).json(offer);
        } else {
            res.status(200).json("Wrong ID || No offer found");
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
});

router.delete("/offer/delete", async (req, res) => {
    // body envoyé = {
    // "id": "6079cdeb0eec8719e4cd85df",
    // }

    try {
        const offer = await Offer.findById(req.fields.id);
        // console.log(offer);
        if (offer) {
            await cloudinary.uploader.destroy(offer.product_image.public_id);
            await cloudinary.api.delete_folder(`/vinted/offer/${offer._id}`);
            await Offer.findByIdAndDelete(req.fields.id);

            res.status(200).json({
                message: "This offer has been deleted",
            });
        } else res.status(200).json("Wrong ID || No offer found");
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
