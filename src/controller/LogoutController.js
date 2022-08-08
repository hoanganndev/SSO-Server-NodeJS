const handleLogout = (req, res) => {
    try {
        res.clearCookie("access_token", {
            domain: process.env.COOKIE_DOMAIN,
            path: "/",
        });
        res.clearCookie("refresh_token", {
            domain: process.env.COOKIE_DOMAIN,
            path: "/",
        });
        return res.status(200).json({
            errorMessage: "Clear cookies done!",
            errorCode: 0,
            data: "",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errorMessage: "error from server",
            errorCode: -1,
            data: "",
        });
    }
};
module.exports = {
    handleLogout,
};
