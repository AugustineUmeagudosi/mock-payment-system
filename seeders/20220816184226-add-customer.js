module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Customers', [{
      id: "fd7092f0-a1f5-48cc-a697-563c242557ad",
      email: "lorem@ipsum.com",
      name: 'Austin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Customers', null, {});
  }
};
