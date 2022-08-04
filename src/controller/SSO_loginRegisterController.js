import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import { createJWT } from "../middleware/JWTAction";
import {
    updateUserRefreshToken,
    updateUserOtpCode,
    isEmailLocal,
    resetUserPassword,
    compareOtpCode,
} from "../service/loginRegisterService";
import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";

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

// Forgot password
const getResetPasswordPage = (req, res) => {
    return res.render("SSO_forgot_password.ejs");
};
const sendOtpCode = async (req, res) => {
    // Validate email, check type account equal LOCAL
    let checkEmailLocal = await isEmailLocal(req.body.email);
    if (!checkEmailLocal) {
        return res.status(401).json({
            errorCode: -1,
            errorMessage: `Not found the email ${req.body.email} in the system`,
            data: "",
        });
    }
    // Send code via email
    const email = req.body.email;
    const userName = email.substring(0, email.lastIndexOf("@"));
    const OTP = Math.floor(100000 + Math.random() * 900000);
    // Read template html file
    const filePath = path.join(__dirname, "../templates/email_template.html");
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const replacements = {
        email: email,
        otp: OTP,
        userName: userName,
    };
    const htmlToSend = template(replacements);
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.GOOGLE_APP_EMAIL, // generated ethereal user
            pass: process.env.GOOGLE_APP_PASSWORD, // generated ethereal password
        },
    });
    res.status(200).json({
        errorCode: 0,
        data: { email: req.body.email },
    });
    // Send mail with defined transport object
    try {
        await transporter.sendMail({
            from: `SSO Server  <${process.env.GOOGLE_APP_EMAIL}>`, // Sender address
            to: email, // List of receivers
            subject: "Reset Password 🔔", // Subject line
            text: "Hello world?", // Plain text body
            html: htmlToSend,
        });

        // Update otpCode in db
        await updateUserOtpCode(email, OTP);
    } catch (error) {
        console.log(error);
    }
};
const handleResetPassword = async (req, res) => {
    try {
        let { newPassword, confirmPassword, email, otpCode } = req.body;
        // Check same password
        if (newPassword !== confirmPassword) {
            return res.status(401).json({
                errorCode: -1,
                errorMessage: "Please enter the correct new password !",
                data: "",
            });
        }
        // Check OTP code
        let isOtpCode = await compareOtpCode(email, otpCode);
        if (isOtpCode) {
            let result = await resetUserPassword(req.body);
            if (result === true) {
                return res.status(200).json({
                    errorCode: 0,
                    errorMessage: "Reset password success !",
                    data: "",
                });
            } else {
                return res.status(500).json({
                    errorCode: -1,
                    errorMessage: "Something wrong ... Please try again !",
                    data: "",
                });
            }
        } else {
            return res.status(401).json({
                errorCode: -1,
                errorMessage: "OTP code is incorrect, Please try again !",
                data: "",
            });
        }
    } catch (error) {
        return res.status(500).json({
            errorCode: -2,
            errorMessage: "Internal error",
            data: "",
        });
    }
};
module.exports = {
    getLoginPage,
    verifySSOToken,
    getResetPasswordPage,
    sendOtpCode,
    handleResetPassword,
};
