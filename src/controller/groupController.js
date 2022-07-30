import groupService from "../service/groupService";

const readGroupsFunction = async (req, res) => {
    try {
        let dataService = await groupService.getGroups();
        return res.status(200).json({
            errorMessage: dataService.errorMessage,
            errorCode: dataService.errorCode,
            data: dataService.data,
        });
    } catch (error) {
        console.log(
            "🔴>>> Error from group controller at readGroupsFunction:",
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
    readGroupsFunction,
};
