import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { Constants } from "../../utils";
import { postTransaction } from "./service";

/**
 * Fetches transaction information for a given op_return data
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @returns { JSON } A JSON response containing the details of the category added
 * @memberof TransactionController
 */
export const creditAccount = async (req, res) => {
    const transaction = _.pick(req.body, Constants.transactionDetails);
    transaction.status = 'pending';
    transaction.id = uuidv4();

    return postTransaction(req.body.customerId, transaction, res);
};
