import { Sequelize, Customer } from "../../../models";
import { customerDetails } from "../../utils/constants";

export const createCustomer = (customer) => {
    return  Customer.create(customer)
        .catch(error => logger.error(error.message));
};

export const getCustomer = (customerId) => {
    return  Transaction.findOne({ where: { id: customerId }, attributes: customerDetails })
        .catch(error => logger.error(error.message));
};