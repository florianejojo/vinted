const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
    try {
        if (!req.headers.authorization)
            res.status(401).json({ message: "Unauthorized, no Token" });
        const token = req.headers.authorization.replace("Bearer ", "");
        const user = await User.findOne({ token: token }).select("account");
        req.user = user;
        if (user) {
            console.log(req);
            next();
        } else {
            res.status(401).json({ message: "Unauthorized, wrong token" });
        }
    } catch {
        res.status(400).json(error.message);
    }
};

module.exports = isAuthenticated;
