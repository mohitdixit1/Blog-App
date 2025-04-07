const { ValidateToken } = require("../services/authentication");

function cheackForAuthCookie(cookieName) {
    return function (req, res, next) {
        const tokenCookieValue = req.cookies[cookieName];// Use the cookieName argument here.

        if (!tokenCookieValue) {
            return next(); // Proceed to the next middleware if no cookie.
        }

        try {
            req.user = ValidateToken(tokenCookieValue);
             // Validate token and attach user info.
            return next(); // Proceed if the token is valid.
        } catch (error) {
            console.error("Token validation error:", error); // Log validation error.
            return next(); // Proceed to the next middleware even if validation fails.
        }
    };
}

module.exports = { cheackForAuthCookie };