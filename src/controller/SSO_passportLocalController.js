import passport from "passport";
import LocalStrategy from "passport-local";
import loginRegisterService from "../service/loginRegisterService";
const configPassportLocal = () => {
    passport.use(
        new LocalStrategy(
            {
                passReqToCallback: true,
            },
            async (req, username, password, done) => {
                const rawData = {
                    valueLogin: username, // Email or phone number
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

module.exports = { configPassportLocal };
