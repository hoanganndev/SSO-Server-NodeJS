import rolesService from "../service/rolesService";
const createRolesFunction = async (req, res) => {
    try {
        let dataService = await rolesService.createNewRoles(req.body);
        return res.status(200).json({
            errorMessage: dataService.errorMessage,
            errorCode: dataService.errorCode,
            data: dataService.data,
        });
    } catch (error) {
        console.log(
            "🔴>>> Error from roles controller at createRolesFunction :",
            error
        );
        return res.status(500).json({
            errorMessage: "Error from server",
            errorCode: -1,
            data: "",
        });
    }
};
const readRolesFunction = async (req, res) => {
    try {
        const { page, limit } = req.query;
        if (page !== "undefined" && limit !== "undefined") {
            let dataService = await rolesService.getRolesWithPagination(
                +page,
                +limit
            );
            return res.status(200).json({
                errorMessage: dataService.errorMessage,
                errorCode: dataService.errorCode,
                data: dataService.data,
            });
        } else {
            let dataService = await rolesService.getAllRoles();
            return res.status(200).json({
                errorMessage: dataService.errorMessage,
                errorCode: dataService.errorCode,
                data: dataService.data,
            });
        }
    } catch (error) {
        console.log(
            "🔴>>> Error from roles controller at readRolesFunction :",
            error
        );
        return res.status(500).json({
            errorMessage: "Error from server",
            errorCode: -1,
            data: "",
        });
    }
};
const updateRoleFunction = async (req, res) => {
    try {
        let dataService = await rolesService.updateRole(req.body);
        return res.status(200).json({
            errorMessage: dataService.errorMessage,
            errorCode: dataService.errorCode,
            data: dataService.data,
        });
    } catch (error) {
        console.log(
            "🔴>>> Error from roles controller at updateFunction :",
            error
        );
        return res.status(500).json({
            errorMessage: "Error from server",
            errorCode: -1,
            data: "",
        });
    }
};
const deleteRoleFunction = async (req, res) => {
    try {
        let dataService = await rolesService.deleteRole(req.body.id);
        return res.status(200).json({
            errorMessage: dataService.errorMessage,
            errorCode: dataService.errorCode,
            data: dataService.data,
        });
    } catch (error) {
        console.log(
            "🔴>>> Error from roles controller at readFunction :",
            error
        );
        return res.status(500).json({
            errorMessage: "Error from server",
            errorCode: -1,
            data: "",
        });
    }
};

module.exports = {
    createRolesFunction,
    readRolesFunction,
    deleteRoleFunction,
    updateRoleFunction,
};
