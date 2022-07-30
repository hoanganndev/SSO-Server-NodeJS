import "dotenv/config";
import jwt from "jsonwebtoken";

const nonSecurePaths = ["/", "/login", "/logout", "/register"];

const createJWT = payload => {
    let secretKey = process.env.JWT_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, secretKey, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
    } catch (err) {
        console.log("🔴>>> Create jwt from server error !", err);
    }
    return token;
};

const verifyToken = token => {
    let secretKey = process.env.JWT_SECRET;
    let decoded = null;
    try {
        decoded = jwt.verify(token, secretKey);
    } catch (err) {
        console.log("🔴>>> Verify jwt from server error !", err);
    }
    return decoded;
};

const extractToken = req => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        return req.headers.authorization.split(" ")[1];
    }
    return null;
};

// Check token validity
const checkUserJWT = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();
    let cookies = req.cookies;
    let tokenFromHeader = extractToken(req);
    if ((cookies && cookies.access_token) || tokenFromHeader) {
        let access_token =
            cookies && cookies.access_token
                ? cookies.access_token
                : tokenFromHeader;
        // Verify token from client
        let decoded = verifyToken(access_token);
        if (decoded) {
            // We can assign another variable with req
            decoded.access_token = access_token;
            decoded.refresh_token = cookies.refresh_token;
            req.user = decoded;
            next();
        } else {
            return res.status(401).json({
                errorMessage: "Not authenticated the user, Please login !",
                errorCode: -1,
                data: "",
            });
        }
    } else {
        return res.status(401).json({
            errorMessage: "Not authenticated the user, Please login !",
            errorCode: -1,
            data: "",
        });
    }
};
// Check user permission
const checkUserPermission = (req, res, next) => {
    if (nonSecurePaths.includes(req.path) || req.path === "/account")
        return next();
    if (req.user) {
        let email = req.user.email;
        let roles = req.user.groupWithRoles.Roles;
        let currentUrl = req.path;
        if (!roles || roles.length === 0) {
            return res.status(403).json({
                errorMessage:
                    "You don't have the permisstion to access this resource... !",
                errorCode: -1,
                data: "",
            });
        }
        let canAccess = roles.some(
            role => role.url === currentUrl || currentUrl.includes(role.url)
        ); // Return true or false
        if (canAccess) {
            next();
        } else {
            return res.status(403).json({
                errorMessage:
                    "You don't have the permisstion to access this resource... !",
                errorCode: -1,
                data: "",
            });
        }
    } else {
        return res.status(401).json({
            errorMessage: "Not authenticated the user, Please login !",
            errorCode: -1,
            data: "",
        });
    }
};
module.exports = {
    createJWT,
    verifyToken,
    checkUserJWT,
    checkUserPermission,
};
