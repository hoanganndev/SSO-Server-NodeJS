import { createNewUser, getListUsers } from "../service/webUserService";

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

module.exports = {
    handleGetHomePage,
    handleUserPage,
    handleCreateNewUser,
};
