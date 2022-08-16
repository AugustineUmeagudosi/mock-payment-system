const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Customer, { foreignKey: 'customerId', as: 'transactions' });
    }
  }
  Transaction.init({
    customerId: { type: DataTypes.UUID, validate: { isUUID: 4 } },
    amount: DataTypes.FLOAT,
    paymentMode: { type: DataTypes.STRING, validate: { isIn: ['cash', 'transfer', 'card', 'cheque', 'other'] } },
    status: { type: DataTypes.STRING, validate: { isIn: ['pending', 'completed', 'failed'] } }
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};