import express from "express";
import LogoutController from "../controller/LogoutController";
import userController from "../controller/userController";
import {
    checkServiceJWT,
    checkUserJWT,
    checkUserPermission,
} from "../middleware/JWTAction";
const router = express.Router();

/**
 * @param {*} app --express app
 */

const initApiRoutes = app => {
    // Middleware check authentication and permisstion all routers
    router.all("*", checkUserJWT, checkUserPermission);

    router.get("/logout", LogoutController.handleLogout);

    router.get("/account", userController.getUserAccountFunction);

    router.get("/verify-services-jwt", checkServiceJWT);

    return app.use("/api/v1/", router);
};

export default initApiRoutes;
