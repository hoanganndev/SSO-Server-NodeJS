import db from "../models";
import {
    checkEmailExist,
    checkPhoneExist,
    checkValidateEmail,
    hashUserPassword,
} from "./inspectionService";

const getAllUsers = async () => {
    try {
        let users = await db.User.findAll({
            attributes: ["id", "username", "email", "phone", "sex"],
            include: { model: db.Group, attributes: ["name", "description"] },
        });
        if (users) {
            return {
                errorMessage: "Get all data users success !",
                errorCode: 0,
                data: users,
            };
        } else {
            return {
                errorMessage: "Get all data success !",
                errorCode: 1,
                data: [],
            };
        }
    } catch (error) {
        console.log("🔴>>> error from user service at getAllUsers:", error);
        return {
            errorMessage: "Something wrong with service !",
            errorCode: -1,
            data: [],
        };
    }
};

const getUserWithPagination = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.User.findAndCountAll({
            attributes: ["id", "username", "email", "phone", "sex", "address"],
            include: {
                model: db.Group,
                attributes: ["name", "description", "id"],
            },
            order: [["id", "DESC"]],
            offset: offset,
            limit: limit,
        });
        let totalPages = Math.ceil(count / limit); // Ex: 4.6 => 5
        let data = {
            totalRows: count,
            totalPages: totalPages,
            users: rows,
        };
        return {
            errorMessage: "Get data with pagination success !",
            errorCode: 0,
            data: data,
        };
    } catch (error) {
        console.log(
            "🔴>>> error from user service at getUserWithPagination:",
            error
        );
        return {
            errorMessage: "Something wrong with service !",
            errorCode: -1,
            data: [],
        };
    }
};

const createNewUser = async data => {
    try {
        let arr = ["email", "phone", "password", "groupId"];
        for (let i = 0; i < arr.length; i++) {
            if (!data[arr[i]]) {
                return {
                    errorMessage: `Input ${arr[i]} is not empty !`,
                    errorCode: 1,
                    data: `${arr[i]}`,
                };
            }
        }
        // Check valid email
        if (!checkValidateEmail(data.email)) {
            return {
                errorMessage: "The email is invalid !",
                errorCode: 1,
                data: "email",
            };
        }
        // Check email/phone number are exist
        let isEmailExist = await checkEmailExist(data.email);
        if (isEmailExist) {
            return {
                errorMessage: "The email is already exist !",
                errorCode: 1,
                data: "email",
            };
        }
        let isPhoneExist = await checkPhoneExist(data.phone);
        if (isPhoneExist) {
            return {
                errorMessage: "The phone number is already exist !",
                errorCode: 1,
                data: "phone",
            };
        }
        // Hash user password
        let hashPassword = hashUserPassword(data.password);
        await db.User.create({ ...data, password: hashPassword });
        return {
            errorMessage: "Create user success !",
            errorCode: 0,
            data: "",
        };
    } catch (error) {
        console.log("🔴>>> error from user service at createNewUser:", error);
        return {
            errorMessage: "Something wrong with service !",
            errorCode: -1,
            data: [],
        };
    }
};

const updateUser = async data => {
    try {
        if (!data.groupId) {
            return {
                errorMessage: "Error with empty GroupId",
                errorCode: 1,
                data: "group",
            };
        }
        let user = await db.User.findOne({
            where: { id: data.id },
        });
        if (user) {
            // Update
            await user.update({
                username: data.username,
                address: data.address,
                sex: data.sex,
                groupId: data.groupId,
            });
            return {
                errorMessage: "Update user success !",
                errorCode: 0,
                data: "",
            };
        } else {
            // Not found user
            return {
                errorMessage: "User not found !",
                errorCode: 1,
                data: "",
            };
        }
    } catch (error) {
        console.log("🔴>>> error from user service at updateUser:", error);
        return {
            errorMessage: "Something wrong with service !",
            errorCode: -1,
            data: [],
        };
    }
};

const deleteUser = async id => {
    try {
        // Find user with id
        let user = await db.User.findOne({
            where: { id: id },
        });
        if (user) {
            await user.destroy(); // Delete user
            return {
                errorMessage: "Delete user succeed !",
                errorCode: 0,
                data: "",
            };
        } else {
            return {
                errorMessage: "User not exist !",
                errorCode: 1,
                data: "",
            };
        }
    } catch (error) {
        console.log("🔴>>> error from user service at deleteUser:", error);
        return {
            errorMessage: "Something wrong with service !",
            errorCode: -1,
            data: [],
        };
    }
};

module.exports = {
    createNewUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserWithPagination,
};
