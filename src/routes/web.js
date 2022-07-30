import express from "express";
import webController from "../controller/webController";
const router = express.Router();

/**
 * @param {*} app --express app
 */

const initWebRoutes = app => {
    router.get("/", webController.handleGetHomePage);
    router.get("/user", webController.handleUserPage);
    router.post("/create-user", webController.handleCreateNewUser);
    router.post("/delete-user/:id", webController.handleDelteUser);
    router.get("/update-user/:id", webController.getUpdateUserPage);
    router.post("/update-user", webController.handleUpdateUser);

    return app.use("/", router);
};
export default initWebRoutes;
