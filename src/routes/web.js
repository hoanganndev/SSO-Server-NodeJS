import express from "express";
import webController from "../controller/webController";
const router = express.Router();

/**
 * @param {*} app --express app
 */

const initWebRoutes = app => {
    router.get("/user", webController.handleUserPage);
    router.post("/create-user", webController.handleCreateNewUser);
    return app.use("/", router);
};
export default initWebRoutes;
