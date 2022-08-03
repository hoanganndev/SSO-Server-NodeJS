import express from "express";
import groupController from "../controller/groupController";
import loginRegisterController from "../controller/loginRegisterController";
import userController from "../controller/userController";
import {
    checkUserJWT,
    checkUserPermission,
    checkServiceJWT,
} from "../middleware/JWTAction";
import rolesController from "../controller/rolesController";
import groupRolesController from "../controller/groupRolesController";
const router = express.Router();

/**
 * @param {*} app --express app
 */

const initApiRoutes = app => {
    // Middleware check authentication and permisstion all routers
    router.all("*", checkUserJWT, checkUserPermission);

    // Router register and login
    router.post("/register", loginRegisterController.handleRegister);
    router.post("/login", loginRegisterController.handleLogin);
    router.get("/logout", loginRegisterController.handleLogout);

    // Router CRUD users
    router.post("/user/create", userController.createUserFunction);
    router.get("/user/read", userController.readUsersFunction);
    router.put("/user/update", userController.updateUserFunction);
    router.delete("/user/delete", userController.deleteUserFunction);

    // Router get current account user
    router.get("/account", userController.getUserAccountFunction);

    // Router get groups
    router.get("/group/read", groupController.readGroupsFunction);

    // Router roles
    router.post("/role/create", rolesController.createRolesFunction);
    router.get("/role/read", rolesController.readRolesFunction);
    router.put("/role/update", rolesController.updateRoleFunction);
    router.delete("/role/delete", rolesController.deleteRoleFunction);

    // Router Group with Roles
    router.get(
        "/roles/by-group/:groupId",
        groupRolesController.getRolesByGroupFunction
    );
    router.post(
        "/roles/assign-to-group",
        groupRolesController.assignRolesToGroupFunction
    );

    //
    router.get("/verify-services-jwt", checkServiceJWT);

    return app.use("/api/v1/", router);
};

export default initApiRoutes;
