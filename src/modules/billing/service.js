import { Sequelize, Transaction } from "../../../models";

export const createTransaction = (transaction) => {
    return  Transaction.create(transaction)
        .catch(error => logger.error(error.message));
};

export const getTransaction = (txid) => {
    return  Transaction.findOne({ where: { id: txid } })
        .catch(error => logger.error(error.message));
};

export const getCustomerById = (customerId) => {
    //
};