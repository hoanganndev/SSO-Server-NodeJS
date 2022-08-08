import "dotenv/config";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import {
    getUserByRefreshToken,
    updateUserRefreshToken,
} from "../service/loginRegisterService";
import "dotenv/config";

const nonSecurePaths = [
    "/",
    "/login",
    "/logout",
    "/register",
    "/verify-services-jwt",
];

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
        if (err instanceof jwt.TokenExpiredError) {
            return "TokenExpiredError";
        } else {
            return err;
        }
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
const checkUserJWT = async (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();
    let cookies = req.cookies;
    let tokenFromHeader = extractToken(req); // Bearer token
    if ((cookies && cookies.access_token) || tokenFromHeader) {
        let access_token =
            cookies && cookies.access_token
                ? cookies.access_token
                : tokenFromHeader;
        // Verify token from client
        let decoded = verifyToken(access_token);
        if (decoded && decoded !== "TokenExpiredError") {
            // We can assign another variable with req
            decoded.access_token = access_token;
            decoded.refresh_token = cookies.refresh_token;
            req.user = decoded;
            next();
        } else if (decoded && decoded === "TokenExpiredError") {
            // Handle refresh token when access token expire
            if (cookies && cookies.refresh_token) {
                let { newAccessToken, newRefreshToken } =
                    await handleRefreshToken(cookies.refresh_token);
                if (newAccessToken && newRefreshToken) {
                    // set cookies
                    res.cookie("access_token", newAccessToken, {
                        maxAge: +process.env.MAX_AGE_ACCESS_TOKEN,
                        httpOnly: true,
                        domain: process.env.COOKIE_DOMAIN,
                        path: "/",
                    });
                    res.cookie("refresh_token", newRefreshToken, {
                        maxAge: +process.env.MAX_AGE_REFRESH_TOKEN,
                        httpOnly: true,
                        domain: process.env.COOKIE_DOMAIN,
                        path: "/",
                    });
                }
                return res.status(405).json({
                    errorMessage: "Need to retry with new token !",
                    errorCode: -1,
                    data: "",
                });
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

const checkServiceJWT = (req, res, next) => {
    let tokenFromHeader = extractToken(req);
    if (tokenFromHeader) {
        let access_token = tokenFromHeader;
        let decoded = verifyToken(access_token);
        // refresh-token
        if (decoded) {
            return res.status(200).json({
                errorCode: 0,
                errorMessage: "Verify the user",
                Data: "",
            });
        } else {
            return res.status(401).json({
                errorCode: -1,
                errorMessage: "Not authenticated the user ",
                Data: "",
            });
        }
    } else {
        return res.status(401).json({
            errorCode: -1,
            errorMessage: "Not authenticated the user ",
            Data: "",
        });
    }
};

const handleRefreshToken = async refreshToken => {
    let newAccessToken = "",
        newRefreshToken = "";
    // Get user
    let user = await getUserByRefreshToken(refreshToken);
    if (user) {
        // Create new access token and refresh token
        let payloadAccessToken = {
            email: user.email,
            groupWithRoles: user.groupWithRoles,
            username: user.username,
        };
        newAccessToken = createJWT(payloadAccessToken);
        newRefreshToken = uuidv4();
        // Update refresh Token for user
        await updateUserRefreshToken(user.email, newRefreshToken);
    }
    return {
        newAccessToken,
        newRefreshToken,
    };
};

module.exports = {
    createJWT,
    verifyToken,
    checkUserJWT,
    checkUserPermission,
    checkServiceJWT,
    handleRefreshToken,
};
