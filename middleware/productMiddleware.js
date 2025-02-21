const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async function (req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const jwtToken = token.startsWith("Bearer ") ? token.slice(7).trim() : token;

        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.token !== jwtToken) {
            return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Something went wrong in the server. Please log in again." });
    }
};
