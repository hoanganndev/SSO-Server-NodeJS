"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert(
            "User",
            [
                {
                    email: "face1@gmail.com",
                    password: "123123",
                    username: "face1",
                    address: "Binh Dinh",
                    sex: "nam",
                    phone: "123",
                    groupId: 1,
                },
                {
                    email: "face2@gmail.com",
                    password: "123123",
                    username: "face2",
                    address: "Binh Dinh",
                    sex: "nam",
                    phone: "123",
                    groupId: 1,
                },
                {
                    email: "face3@gmail.com",
                    password: "123123",
                    username: "face3",
                    address: "Binh Dinh",
                    sex: "nam",
                    phone: "123",
                    groupId: 1,
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
