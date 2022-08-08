const isLogin = (req, res, next) => {
    const pathName = req.path;
    if (req.isAuthenticated()) {
        // This function at passport
        if (pathName === "/login") {
            return res.redirect("/");
        }
        next();
    } else {
        if (pathName === "/login") {
            next();
        } else {
            return res.redirect("/login");
        }
    }
};
module.exports = { isLogin };
