import db from "../models";

const getGroups = async () => {
    try {
        let data = await db.Group.findAll({
            order: [["name", "ASC"]],
        });
        return {
            errorMessage: "Get groups success !",
            errorCode: 0,
            data: data,
        };
    } catch (error) {
        console.log("🔴>>> error from group service at getGroups:", error);
        return {
            errorMessage: "Something wrong with service !",
            errorCode: -1,
            data: [],
        };
    }
};

module.exports = {
    getGroups,
};
