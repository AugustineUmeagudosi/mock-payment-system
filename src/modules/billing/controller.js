import _ from "lodash";
import { Response, Constants } from "../../utils";
import { getCustomerById, createTransaction, getCustomerEnquiryResponse, postTransactionToWorker } from "./service";

/**
 * Fetches transaction information for a given op_return data
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @returns { JSON } A JSON response containing the details of the category added
 * @memberof TransactionController
 */
export const creditAccount = async (req, res) => {
    getCustomerById(req.body.customerId);
    const customer = await getCustomerEnquiryResponse();
    if (!customer) return Response.error(res, `Invalid customer`, 400);

    const transaction = _.pick(req.body, Constants.transactionDetails);
    transaction.status = 'pending';
    const transactionDetails = await createTransaction(transaction);

    postTransactionToWorker(transactionDetails);
    // get customer from customer service
    // create transaction in the db with status of pending
    // call billiong worker and create job

    return Response.info(res, 'Transaction proccessed successfully!', 200, null);
};
