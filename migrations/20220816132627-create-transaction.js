module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.UUID },
      customerId: { type: Sequelize.UUID, allowNull: false, foreignKey: true, references: { model: 'Customers' } },
      amount: { type: Sequelize.FLOAT },
      paymentMode: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};