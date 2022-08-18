import amqp from 'amqplib/callback_api';
import { Response } from "../../utils";
import { createJob } from '../../../config/jobs';

import { v4 as uuidv4 } from 'uuid';
import { Sequelize, Transaction } from "../../../models";

const customerEnquiryQueue = process.env.CUSTOMER_ENQUIRY_QUEUE;
const customerEnquiryResponseQueue = process.env.CUSTOMER_ENQUIRY_RESPONSE_QUEUE;
const rabbitMQServer = process.env.NODE_ENV === 'test' ? process.env.RABBITMQ_SERVER : process.env.RABBITMQ_SERVER_REMOTE;

// fetch customer details from customer service
export const postTransaction = (customerId, transaction, res) => {
    amqp.connect(rabbitMQServer, function(error0, connection) {
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
                        createJob({ type: process.env.BILLING_WORKER_EVENT, data: { transaction }, delay: 100 });
                        return Response.info(res, 'Transaction posted successfully!', 201, null);
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

export const approveTransaction = (id) => {
    return Transaction.update({ status: 'completed' }, { where: { id } })
        .catch(error => logger.error(error.message));
};
