// EXPRESS FORMIDABLE CORS
const express = require("express");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");

// STRIPE
const stripe = require("stripe")("sk_test_votreCléPrivée");
const app = express();


// CLOUDINARY
// const cloudinary = require("cloudinary").v2;

// MODELS
// const Offer = require("../models/Offer");
// const User = require("../models/User");

// CHECK AUTH
// const isAuthenticated = require("../middlewares/isAuthenticated");

// ROUTER
const router = express.Router();

app.use(formidableMiddleware());
app.use(cors());

router.post("/payment", async (req, res) => {

    // objet à envoyer : {
    // id de l'article pour aller chercher le vrai prix dans la DB
    // description de l'objet acheté
    // token de la transaction
    // }

    const stripeToken = req.fields.stripeToken;
    const response = await stripe.charges.create({
        amount: 2000,
        currency: "eur",
        description: "La description de l'objet acheté",
        // On envoie ici le token
        source: stripeToken,
      });
      console.log(response.status);
      res.json(response);

})


"/pay", async (req, res) => {
    // Réception du token créer via l'API Stripe depuis le Frontend
    
    // Créer la transaction
    
    console.log(response.status);
  
    // TODO
    // Sauvegarder la transaction dans une BDD MongoDB
  
    res.json(response);
  });
  
  app.listen(3100, () => {
    console.log("Server started");
  });

module.exports = router;
