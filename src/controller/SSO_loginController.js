import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import { createJWT } from "../middleware/JWTAction";
import { updateUserRefreshToken } from "../service/loginRegisterService";

const getLoginPage = (req, res) => {
    // Validate url
    const { serviceURL } = req.query;
    return res.render("SSO_login.ejs", { redireactURL: serviceURL });
};

const verifySSOToken = async (req, res) => {
    try {
        const { ssoToken } = req.body;
        // Compare session id successed
        if (req.user && req.user.code && req.user.code === ssoToken) {
            const refreshToken = uuidv4();
            // Update user
            await updateUserRefreshToken(req.user.email, refreshToken);
            // Create access token
            let payload = {
                email: req.user.email,
                username: req.user.username,
                groupWithRoles: req.user.groupWithRoles,
            };
            let token = createJWT(payload);
            // Set cookies
            res.cookie("access_token", token, {
                maxAge: +process.env.MAX_AGE_ACCESS_TOKEN,
                httpOnly: true,
                domain: process.env.COOKIE_DOMAIN,
                path: "/",
            });
            res.cookie("refresh_token", refreshToken, {
                maxAge: +process.env.MAX_AGE_REFRESH_TOKEN,
                httpOnly: true,
                domain: process.env.COOKIE_DOMAIN,
                path: "/",
            });
            const resData = {
                access_token: token,
                refresh_token: refreshToken,
                email: req.user.email,
                username: req.user.username,
                groupWithRoles: req.user.groupWithRoles,
            };
            // Remove session in db
            req.session.destroy(function (err) {
                req.logout(function (error) {
                    if (err) {
                        return err;
                    }
                });
            });
            // remove session in cookies
            res.clearCookie("connect.sid", {
                domain: process.env.COOKIE_DOMAIN,
                path: "/",
            });
            return res.status(200).json({
                errorMessage: "ok",
                errorCode: 0,
                data: resData,
            });
        } else {
            return res.status(401).json({
                errorMessage: "not match ssoToken",
                errorCode: 1,
                data: "",
            });
        }
    } catch (error) {
        console.log(">>> error from verifySSOToken", error);
    }
};
module.exports = {
    getLoginPage,
    verifySSOToken,
};
