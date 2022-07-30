import Sequelize from "sequelize";
import session from "express-session";
import passport from "passport";
import "dotenv/config";
const configSession = app => {
    // initalize sequelize with session store
    const SequelizeStore = require("connect-session-sequelize")(session.Store);
    // create database, ensure 'mysql' in your package.json
    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT,
            logging: false,
            define: {
                freezeTableName: true,
            },
            timezone: "+07:00",
        }
    );
    // create table session
    const myStore = new SequelizeStore({
        db: sequelize,
    });
    app.use(
        session({
            secret: "secret-session",
            store: myStore,
            resave: false, // we support the touch method so per the express-session docs this should be set to false
            proxy: true, // if you do SSL outside of node.
            saveUninitialized: false,
            expiration: 60 * 60 * 1000, // set expire session in DB
            cookie: { expires: 60 * 60 * 1000 }, // set expire session cookies in browser
        })
    );
    // aync session table at the database, create and compare session id
    myStore.sync();

    // to know that using passport to validate user throught session
    app.use(passport.authenticate("session"));

    // after data is returned from configpassport ==> data will come to serializeUser
    // then serializeUser will save it back to table session in database
    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            cb(null, user);
        });
    });
    passport.deserializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user); // req.user will assign to req at all req in express
        });
    });
};
export default configSession;
