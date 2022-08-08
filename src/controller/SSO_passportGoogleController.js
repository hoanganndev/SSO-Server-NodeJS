import "dotenv/config";
import passport from "passport";
import { v4 as uuidv4 } from "uuid";
import { upsertUserSocialMedia } from "../service/loginRegisterService";
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const configPassportGoogle = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_APP_CLIENT_ID,
                clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_APP_REDIRECT_LOGIN,
            },
            async function (accessToken, refreshToken, profile, cb) {
                const accountType = "GOOGLE";
                const newUser = profile.displayName
                    ? profile.displayName
                    : profile.emails[0].value.substring(
                          0,
                          profile.emails[0].value.lastIndexOf("@")
                      );
                let rawData = {
                    username: newUser ? newUser : `user-${profile.id}`,
                    email:
                        profile.emails && profile.emails.length > 0
                            ? profile.emails[0].value
                            : profile.id,
                };
                let user = await upsertUserSocialMedia(accountType, rawData);
                user.code = uuidv4();
                return cb(null, user); // After return this data will res to callbackURL
            }
        )
    );
};
module.exports = { configPassportGoogle };
