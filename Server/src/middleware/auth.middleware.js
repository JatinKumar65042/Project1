const jwt = require('jsonwebtoken') ;

const isLoggedIn = (req , res , next) => {
    try {
        const token = (req.cookies && req.cookies.token) || null;
        console.log(token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "You need to sign in to access this route",
            });
        }
        console.log("I came here")

        // Verify token and handle errors
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next(); // Move to the next middleware
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please sign in again.",
        });
    }
}

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({
            success : false ,
            message : "You are not authorized to access this route"
        })
    }
    next() ;
};

module.exports = {isLoggedIn , isAdmin} ; 