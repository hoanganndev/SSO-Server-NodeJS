const getUserAccountFunction = async (req, res) => {
    try {
        let { groupWithRoles, email, username, access_token, refresh_token } =
            req.user;
        let userData = {
            access_token,
            refresh_token,
            email,
            username,
            groupWithRoles,
        };
        return res.status(200).json({
            errorMessage: "Get user account sucess !",
            errorCode: 0,
            data: userData,
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
    getUserAccountFunction,
};
