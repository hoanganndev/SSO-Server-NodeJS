import groupRolesService from "../service/groupRolesService";

const getRolesByGroupFunction = async (req, res) => {
    try {
        let id = req.params.groupId;
        let dataService = await groupRolesService.getRolesByGroup(id);
        return res.status(200).json({
            errorMessage: dataService.errorMessage,
            errorCode: dataService.errorCode,
            data: dataService.data,
        });
    } catch (error) {
        console.log(
            "🔴>>> Error from roles controller at getRoleByGroupFunction :",
            error
        );
        return res.status(500).json({
            errorMessage: "Error from server",
            errorCode: -1,
            data: "",
        });
    }
};
const assignRolesToGroupFunction = async (req, res) => {
    try {
        let dataService = await groupRolesService.assignRolesToGroup(
            req.body.data
        );
        return res.status(200).json({
            errorMessage: dataService.errorMessage,
            errorCode: dataService.errorCode,
            data: dataService.data,
        });
    } catch (error) {
        console.log(
            "🔴>>> Error from roles controller at assignRoleToGroupFunction :",
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
    getRolesByGroupFunction,
    assignRolesToGroupFunction,
};
