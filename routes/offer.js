const express = require("express");

// const Offer = require("../models/Offer");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = express.Router();

router.post("/offer/publish", isAuthenticated, async (req, res) => {
    try {
        // vérifier que le user est identifié grâce au token

        res.status(200).json("route okay");
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports = router;
