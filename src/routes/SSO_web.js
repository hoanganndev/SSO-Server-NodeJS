import express from "express";
import passport from "passport";
import SSO_loginRegisterController from "../controller/SSO_loginRegisterController";
import webController from "../controller/webController";
import { isLogin } from "../middleware/SSO_checkUserLogin";
const router = express.Router();

/**
 * @param {*} app --express app
 */

const initSSOWebRoutes = app => {
    router.get("/", isLogin, webController.handleGetHomePage);
    // Login local
    router.get("/login", isLogin, SSO_loginRegisterController.getLoginPage);
    router.post("/login", function (req, res, next) {
        passport.authenticate("local", function (error, user, info) {
            if (error) {
                return res.status(500).json(error);
            }
            if (!user) {
                return res.status(401).json(info.message);
            }
            req.login(user, function (err) {
                if (err) return next(err);
                const { serviceURL } = req.body;
                return res.status(200).json({
                    ...user,
                    redirectURL: serviceURL,
                });
            });
        })(req, res, next);
    });

    // Login Google
    router.get(
        "/auth/google",
        passport.authenticate("google", { scope: ["profile", "email"] })
    );

    router.get(
        "/google/redirect",
        passport.authenticate("google", { failureRedirect: "/login" }),
        function (req, res) {
            //save cookies
            const ssoToken = req.user.code;
            return res.render("SSO_socials.ejs", { ssoToken });
        }
    );

    // Login Facebook
    router.get(
        "/auth/facebook",
        passport.authenticate("facebook", { scope: ["email"] })
    );

    router.get(
        "/facebook/redirect",
        passport.authenticate("facebook", { failureRedirect: "/login" }),
        function (req, res) {
            //save cookies
            console.log(">>> req.user", req.user);
            const ssoToken = req.user.code;
            return res.render("SSO_socials.ejs", { ssoToken });
        }
    );

    // Forgot password
    router.get(
        "/forgot-password",
        SSO_loginRegisterController.getResetPasswordPage
    );
    router.post("/send-otp-code", SSO_loginRegisterController.sendOtpCode);
    router.post(
        "/submit-reset-password",
        SSO_loginRegisterController.handleResetPassword
    );

    router.post("/verify-token", SSO_loginRegisterController.verifySSOToken);
    return app.use("/", router);
};
export default initSSOWebRoutes;
