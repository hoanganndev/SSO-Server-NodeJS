"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // User => Group : 1.1
            // A.belongsTo(B) => foreign key being defind in the target model A
            User.belongsTo(models.Group, { foreignKey: "groupId" });
            // Employee => Project : n.n
            User.belongsToMany(models.Project, {
                through: "Project_User",
                foreignKey: "userId",
            });
        }
    }
    User.init(
        {
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            username: DataTypes.STRING,
            address: DataTypes.STRING,
            sex: DataTypes.STRING,
            phone: DataTypes.STRING,
            groupId: DataTypes.INTEGER,
            refreshToken: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
