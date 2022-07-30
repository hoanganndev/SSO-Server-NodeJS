import db from "../models";
const createNewRoles = async roles => {
    try {
        console.log(">>> check roles", roles);
        let currentRoles = await db.Role.findAll({
            attributes: ["url", "description"],
            raw: true,
        });
        console.log(">>> currentRoles", currentRoles);
        // Get diffrence between two arrays
        const persists = roles.filter(
            ({ url: url_1 }) =>
                !currentRoles.some(({ url: url_2 }) => url_2 === url_1)
        );
        if (persists.length === 0) {
            return {
                errorMessage: "Nothing to create !",
                errorCode: 0,
                data: "",
            };
        }
        await db.Role.bulkCreate(persists); // Input: array
        return {
            errorMessage: `Create roles succeed: ${persists.length} roles... !`,
            errorCode: 0,
            data: "",
        };
    } catch (error) {
        console.log("🔴>>> Error from roles service at createNewRoles:", error);
        return {
            errorMessage: "Something wrongs in service !",
            errorCode: -1,
            data: [],
        };
    }
};

const getAllRoles = async () => {
    try {
        let rolesData = await db.Role.findAll({
            order: [["id", "DESC"]],
        });
        if (rolesData) {
            return {
                errorMessage: "Get all roles succeeds !",
                errorCode: 0,
                data: rolesData,
            };
        } else {
            return {
                errorMessage: "Get all roles falsed !",
                errorCode: 1,
                data: [],
            };
        }
    } catch (error) {
        console.log("🔴>>> Error from roles service at getAllRoles:", error);
        return {
            errorMessage: "Something wrongs in service !",
            errorCode: -1,
            data: [],
        };
    }
};

const getRolesWithPagination = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.Role.findAndCountAll({
            attributes: ["id", "url", "description"],
            order: [["id", "DESC"]],
            offset,
            limit,
        });
        let totalPages = Math.ceil(count / limit); // ceil làm tròn lên
        let data = {
            totalRows: count,
            totalPages: totalPages,
            roles: rows,
        };
        return {
            errorMessage: "Get data roles with pagination success !",
            errorCode: 0,
            data: data,
        };
    } catch (error) {
        console.log("🔴>>> Error from roles service at getAllRoles:", error);
        return {
            errorMessage: "Something wrongs in service !",
            errorCode: -1,
            data: [],
        };
    }
};
const updateRole = async data => {
    try {
        let role = await db.Role.findOne({
            where: { id: data.id },
        });
        if (role) {
            await role.update({
                url: data.url,
                description: data.description,
            });
            return {
                errorMessage: "Update role success !",
                errorCode: 0,
                data: "",
            };
        } else {
            return {
                errorMessage: "Role not found !",
                errorCode: 1,
                data: "",
            };
        }
    } catch (error) {
        console.log("🔴>>> error from userService at updateUser:", error);
        return {
            errorMessage: "Something wrong with service !",
            errorCode: -1,
            data: [],
        };
    }
};
const deleteRole = async id => {
    try {
        let role = await db.Role.findOne({
            where: { id },
        });
        if (role) {
            await role.destroy();
        }
        return {
            errorMessage: `Delete ${role.url} succeed !`,
            errorCode: 0,
            data: role,
        };
    } catch (error) {
        console.log("🔴>>> Error from roles service at deleteRole:", error);
        return {
            errorMessage: "Something wrongs in service !",
            errorCode: -1,
            data: [],
        };
    }
};

module.exports = {
    createNewRoles,
    getAllRoles,
    deleteRole,
    getRolesWithPagination,
    updateRole,
};
