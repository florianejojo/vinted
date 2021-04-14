const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    console.log("isAuth", token);
    const user = await User.findOne({ token: token });
    req.user = user;
    if (user) {
        console.log(req);
        next();
    } else {
        res.status(401).json({ message: "Unauthorized, wrong token" });
    }
};

module.exports = isAuthenticated;
