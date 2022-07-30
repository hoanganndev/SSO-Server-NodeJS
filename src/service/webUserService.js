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

const deleteUser = async userId => {
    await db.User.destroy({
        where: { id: userId },
    });
};

const getUserById = async id => {
    let user = {};
    user = await db.User.findOne({
        where: { id: id },
    });
    return user.get({ plain: true });
};

const updateUserInfor = async (email, username, id) => {
    await db.User.update(
        { email: email, username: username },
        {
            where: { id: id },
        }
    );
};

module.exports = {
    createNewUser,
    getListUsers,
    deleteUser,
    getUserById,
    updateUserInfor,
};
