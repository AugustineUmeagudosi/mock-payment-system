module.exports = {
  async up (queryInterface, Sequelize) {
    const id = "fd7092f0-a1f5-48cc-a697-563c242557ad";
    const customer = await queryInterface.rawSelect('Customers', {where: {id},}, ['id']);
    
    if(!customer) {
      await queryInterface.bulkInsert('Customers', [{
        id,
        email: "lorem@ipsum.com",
        name: 'Austin',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Customers', null, {});
  }
};
