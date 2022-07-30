import {
    createNewUser,
    deleteUser,
    getListUsers,
    getUserById,
    updateUserInfor,
} from "../service/webUserService";

const handleGetHomePage = (req, res) => {
    return res.render("home.ejs");
};

const handleUserPage = async (req, res) => {
    try {
        let listUsers = await getListUsers();
        return res.render("user.ejs", { listUsers });
    } catch (error) {
        console.log(error);
    }
};

const handleCreateNewUser = (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let username = req.body.username;
        createNewUser(email, password, username);
        return res.redirect("/user");
    } catch (error) {
        console.log(error);
    }
};

const handleDelteUser = async (req, res) => {
    try {
        await deleteUser(req.params.id);
        return res.redirect("/user");
    } catch (error) {
        console.log(error);
    }
};

const getUpdateUserPage = async (req, res) => {
    try {
        let userData = {};
        let id = req.params.id;
        let user = await getUserById(id);
        userData = user;
        return res.render("user-update.ejs", { userData });
    } catch (error) {
        console.log(error);
    }
};

const handleUpdateUser = async (req, res) => {
    try {
        let email = req.body.email;
        let username = req.body.username;
        let id = req.body.id;

        await updateUserInfor(email, username, id);

        return res.redirect("/user");
    } catch (error) {
        console.log(error);
    }
};

const handleUserGetAPI = async (req, res) => {
    try {
        setTimeout(async () => {
            let listUsers = await getlistUsers();
            return res.status(200).json(listUsers);
        }, 100);
    } catch (error) {
        console.log(error);
    }
};

const handleDelteUserAPI = async (req, res) => {
    try {
        await deleteUser(req.params.id);
        return res.status(200).json({
            message: `User with the id = ${req.params.id} is deleted successfully!`,
            errCode: 0,
        });
    } catch (error) {
        console.log(error);
    }
};

const handleCreateNewUserAPI = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let username = req.body.username;

        setTimeout(async () => {
            await createNewUser(email, password, username);

            return res.status(200).json({
                message: `A new User is created successfully!`,
                errCode: 0,
            });
        }, 5000);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    handleGetHomePage,
    handleUserPage,
    handleCreateNewUser,
    handleDelteUser,
    getUpdateUserPage,
    handleUpdateUser,
    handleUserGetAPI,
    handleDelteUserAPI,
    handleCreateNewUserAPI,
};
