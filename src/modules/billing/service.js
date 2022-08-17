import amqp from 'amqplib/callback_api';
import { Response, Constants } from "../../utils";

import { v4 as uuidv4 } from 'uuid';
import { Sequelize, Transaction } from "../../../models";

const customerEnquiryQueue = process.env.CUSTOMER_ENQUIRY_QUEUE;
const customerEnquiryResponseQueue = process.env.CUSTOMER_ENQUIRY_RESPONSE_QUEUE;

// fetch customer details from customer service
export const postTransaction = (customerId, transaction, res) => {
    amqp.connect(process.env.RABBITMQ_SERVER, function(error0, connection) {
        if (error0) throw error0;

        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            channel.assertQueue(customerEnquiryResponseQueue, {
                exclusive: false
            }, function(error2, q) {
                if (error2) throw error2;

                const correlationId = uuidv4();
    
                channel.consume(q.queue, async function(msg) {
                    if (msg.properties.correlationId === correlationId) {
                        channel.ack(msg);
                        channel.close(); 
                        if(msg.content.toString() === 'null') return Response.error(res, `Invalid customer`, 400);
                        
                        await createTransaction(transaction);
                        // create job here
                        return Response.info(res, 'Transaction posted successfully!', 200, null);
                    }
                }, {
                    noAck: true
                });
    
                channel.sendToQueue(customerEnquiryQueue,
                    Buffer.from(customerId.toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {method: 'getCustomerById'}
                    });
            });
        });
    });
};

export const createTransaction = (transaction) => {
    return Transaction.create(transaction)
        .catch(error => logger.error(error.message));
};

export const getTransaction = (txid) => {
    return  Transaction.findOne({ where: { id: txid } })
        .catch(error => logger.error(error.message));
};

export const updateTransaction = (transaction) => {
    return Transaction.create(transaction)
        .catch(error => logger.error(error.message));
};
