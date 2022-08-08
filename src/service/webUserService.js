import db from "../models/index";
import { hashUserPassword } from "./inspectionService";

const createNewUser = async (email, password, username) => {
    let hashPass = hashUserPassword(password);
    try {
        await db.User.create({
            username: username,
            email: email,
            password: hashPass,
        });
    } catch (error) {
        console.log(">>> check error: ", error);
    }
};

const getListUsers = async () => {
    let users = [];
    users = await db.User.findAll();
    return users;
};

module.exports = {
    createNewUser,
    getListUsers,
};
