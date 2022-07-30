import passport from "passport";
import LocalStrategy from "passport-local";
import loginRegisterService from "../service/loginRegisterService";
const configPassport = () => {
    passport.use(
        new LocalStrategy(
            {
                passReqToCallback: true,
            },
            async (req, username, password, done) => {
                const rawData = {
                    valueLogin: username,
                    password: password,
                };
                let res = await loginRegisterService.handleUserLogin(rawData);
                if (res && +res.errorCode === 0) {
                    return done(null, res.data); // Assign user to all req: req.user
                } else {
                    return done(null, false, { message: res.errorMessage });
                }
            }
        )
    );
};
// Function for test code
const handleLogout = (req, res, next) => {
    req.session.destroy(function (err) {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect("/login");
        }); // just only remove session at database, browser still not
    });
};
module.exports = { configPassport, handleLogout };
