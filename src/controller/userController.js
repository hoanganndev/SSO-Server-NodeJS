import userService from "../service/userService";

const readUsersFunction = async (req, res) => {
    try {
        // http://localhost:8080/api/v1/user/read?page=6&limit=5
        if (req.query.page !== "undefined" && req.query.limit !== "undefined") {
            let page = req.query.page;
            let limit = req.query.limit;
            let dataService = await userService.getUserWithPagination(
                +page,
                +limit
            );
            return res.status(200).json({
                errorMessage: dataService.errorMessage,
                errorCode: dataService.errorCode,
                data: dataService.data,
            });
        } else if (
            req.query.page === "undefined" &&
            req.query.limit === "undefined"
        ) {
            let dataService = await userService.getAllUsers();
            return res.status(200).json({
                errorMessage: dataService.errorMessage,
                errorCode: dataService.errorCode,
                data: dataService.data,
            });
        }
    } catch (error) {
        console.log(
            "🔴>>> Error from user controller at readUsersFunction:",
            error
        );
        return res.status(500).json({
            errorMessage: "Error from server",
            errorCode: -1,
            data: "",
        });
    }
};

const createUserFunction = async (req, res) => {
    try {
        let dataService = await userService.createNewUser(req.body);
        return res.status(200).json({
            errorMessage: dataService.errorMessage,
            errorCode: dataService.errorCode,
            data: dataService.data,
        });
    } catch (error) {
        console.log(
            "🔴>>> Error from user controller at createUserFunction:",
            error
        );
        return res.status(500).json({
            errorMessage: "Error from server",
            errorCode: -1,
            data: "",
        });
    }
};

const updateUserFunction = async (req, res) => {
    try {
        let dataService = await userService.updateUser(req.body);
        return res.status(200).json({
            errorMessage: dataService.errorMessage,
            errorCode: dataService.errorCode,
            data: dataService.data,
        });
    } catch (error) {
        console.log(
            "🔴>>> Error from user controller at updateUserFunction :",
            error
        );
        return res.status(500).json({
            errorMessage: "Error from server",
            errorCode: -1,
            data: "",
        });
    }
};

const deleteUserFunction = async (req, res) => {
    try {
        let dataService = await userService.deleteUser(req.body.id);
        return res.status(200).json({
            errorMessage: dataService.errorMessage,
            errorCode: dataService.errorCode,
            data: dataService.data,
        });
    } catch (error) {
        console.log(
            "🔴>>> Error from user controller at deleteUserFunction :",
            error
        );
        return res.status(500).json({
            errorMessage: "Error from server",
            errorCode: -1,
            data: "",
        });
    }
};

const getUserAccountFunction = async (req, res) => {
    try {
        let { groupWithRoles, email, username, access_token, refresh_token } =
            req.user;
        return res.status(200).json({
            errorMessage: "Get user account sucess !",
            errorCode: 0,
            data: {
                access_token,
                refresh_token,
                email,
                username,
                groupWithRoles,
            },
        });
    } catch (error) {
        console.log(
            "🔴>>> Error from userController at deleteFunction :",
            error
        );
        return res.status(500).json({
            errorMessage: "Error from server",
            errorCode: -1,
            data: "",
        });
    }
};
module.exports = {
    readUsersFunction,
    createUserFunction,
    updateUserFunction,
    deleteUserFunction,
    getUserAccountFunction,
};
