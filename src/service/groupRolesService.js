import db from "../models";

const getRolesByGroup = async id => {
    try {
        if (!id) {
            return {
                errorMessage: "Not found any roles",
                errorCode: 1,
                data: {},
            };
        }
        let roles = await db.Group.findOne({
            where: { id },
            attributes: ["id", "name", "description"],
            include: {
                model: db.Role,
                attributes: ["id", "url", "description"],
                through: { attributes: [] }, //! Don't get attibutes group-role
            },
        });
        return {
            errorMessage: "Get roles by group success !",
            errorCode: 0,
            data: roles ? roles : {},
        };
    } catch (error) {
        console.log(
            "🔴>>> Error from group roles service at getRolesByGroup:",
            error
        );
        return {
            errorMessage: "Something wrongs in service !",
            errorCode: -1,
            data: [],
        };
    }
};
const assignRolesToGroup = async data => {
    try {
        //! data ={groupId:4,groupRoles:[{},{}]}
        await db.Group_Role.destroy({
            where: { groupId: data.groupId },
        });
        await db.Group_Role.bulkCreate(data.groupRoles);
        return {
            errorMessage: "Assign roles for group success !",
            errorCode: 0,
            data: [],
        };
    } catch (error) {
        console.log(
            "🔴>>> Error from group roles service at assignRolesToGroup:",
            error
        );
        return {
            errorMessage: "Something wrongs in service !",
            errorCode: -1,
            data: [],
        };
    }
};

module.exports = {
    getRolesByGroup,
    assignRolesToGroup,
};
