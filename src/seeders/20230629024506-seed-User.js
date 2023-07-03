const UsersManager = require('../utils/UsersManager');
const crypto = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const saltRounds = 10;
    const hashPassword = await crypto.hash("fabrirandon", saltRounds);

    await queryInterface.bulkInsert('Users', [
      {
        username: "randall",
        mail: "rfbiermann@uc.cl",
        password: hashPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
console.log(UsersManager.createNewToken(1, "admin", 365));