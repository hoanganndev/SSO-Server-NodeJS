import "dotenv/config";
import { Op } from "sequelize"; // operator in sequelize: toan tu
import { v4 as uuidv4 } from "uuid";
import db from "../models";
import { checkPassword, hashUserPassword } from "./inspectionService";
import { getGroupWithRoles } from "./rolesOfGroupService";

const handleUserLogin = async rawData => {
    try {
        // Find user with email or phone number
        let user = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: rawData.valueLogin },
                    { phone: rawData.valueLogin },
                ],
            },
        });
        if (user) {
            // Check is correct user password
            let isCorrectPassword = checkPassword(
                rawData.password,
                user.password
            );
            if (isCorrectPassword === true) {
                const code = uuidv4();
                let groupWithRoles = await getGroupWithRoles(user);
                return {
                    errorMessage: "Server is checking login...!",
                    errorCode: 0,
                    data: {
                        code,
                        email: user.email,
                        username: user.username,
                        groupWithRoles,
                    },
                };
            }
        }
        return {
            errorMessage: "Your email/phone number or password is incorrect !",
            errorCode: 1,
            data: "",
        };
    } catch (error) {
        console.log(error);
        return {
            errorMessage: "Something wrongs in service...",
            errorCode: -2,
        };
    }
};

const updateUserRefreshToken = async (email, token) => {
    try {
        await db.User.update(
            {
                refreshToken: token,
            },
            { where: { email } }
        );
    } catch (error) {
        console.log(">>> error updateUserRefreshToken", error);
    }
};

// Update or insert new user from social media
const upsertUserSocialMedia = async (accountType, rawData) => {
    try {
        let user = null;
        user = await db.User.findOne({
            where: {
                email: rawData.email,
                accountType: accountType,
            },
        });
        if (!user) {
            // Create new user
            user = await db.User.create({
                email: rawData.email,
                username: rawData.username,
                accountType: accountType,
            });
        }
        return user.get({ plain: true });
    } catch (error) {
        console.log(">>> check error", error);
    }
};

const getUserByRefreshToken = async token => {
    try {
        let user = await db.User.findOne({
            where: {
                refreshToken: token,
            },
        });
        if (user) {
            let groupWithRoles = await getGroupWithRoles(user);
            return {
                email: user.email,
                username: user.username,
                groupWithRoles: groupWithRoles,
            };
        }
        return null;
    } catch (error) {
        console.log(error);
    }
};

// Forgot password
const isEmailLocal = async email => {
    try {
        let user = await db.User.findOne({
            where: { email, accountType: "LOCAL" },
        });
        if (user) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};
const compareOtpCode = async (email, otpCode) => {
    try {
        let user = await db.User.findOne({
            where: { email, accountType: "LOCAL", otpCode },
        });
        if (user) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};
const resetUserPassword = async rawData => {
    try {
        let { otpCode, email, newPassword } = rawData;
        let resetPassword = hashUserPassword(newPassword);
        let count = await db.User.update(
            {
                password: resetPassword,
                otpCode: "",
            },
            {
                where: {
                    email: email,
                    otpCode: otpCode,
                    accountType: "LOCAL",
                },
            }
        );
        if (count && count[0] > 0) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
};
const updateUserOtpCode = async (email, otpCode) => {
    try {
        await db.User.update(
            {
                otpCode: otpCode,
            },
            { where: { email, accountType: "LOCAL" } }
        );
    } catch (error) {
        console.log(">>> error updateUserOtpCode", error);
    }
};

module.exports = {
    handleUserLogin,
    updateUserRefreshToken,
    upsertUserSocialMedia,
    getUserByRefreshToken,
    isEmailLocal,
    resetUserPassword,
    updateUserOtpCode,
    compareOtpCode,
};
