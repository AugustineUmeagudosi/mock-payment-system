import { Sequelize, Transaction } from "../../../models";
import { connect } from 'amqplib';

const connection = connect(process.env.RABBITMQ_SERVER);
const customerEnquiryQueue = process.env.CUSTOMER_ENQUIRY_QUEUE;
const customerEnquiryResponseQueue = process.env.CUSTOMER_ENQUIRY_RESPONSE_QUEUE;
const billingWorkerQueue = process.env.BILLING_WORKER_QUEUE;

export const createTransaction = (transaction) => {
    return Transaction.create(transaction)
        .catch(error => logger.error(error.message));
};

export const getTransaction = (txid) => {
    return  Transaction.findOne({ where: { id: txid } })
        .catch(error => logger.error(error.message));
};

// publishes customerId to customer service
export const getCustomerById = (customerId) => {
    connection.then((conn) => {
        return conn.createChannel();
      }).then((channel) => {
        return channel.assertQueue(customerEnquiryQueue).then(() => {
          return channel.sendToQueue(customerEnquiryQueue, Buffer.from(JSON.stringify(customerId)));
        });
    }).catch(error => logger.error(error.message));
};

// listens for customer details from customer service
export const getCustomerEnquiryResponse = () => {
    connection.then((conn) => {
        return conn.createChannel();
    }).then((channel) => {
        return channel.assertQueue(customerEnquiryResponseQueue).then(() => {
            return channel.consume(customerEnquiryResponseQueue, (msg) => {
                if (msg !== null) {
                    const customerData = JSON.parse(msg.content.toString());
                    channel.ack(msg);
                    channel.close();

                    return customerData;
                }
            });
        });
    }).catch(error => logger.error(error.message));
};

// publishes transaction to billing worker service
export const postTransactionToWorker = (transaction) => {
    connection.then((conn) => {
        return conn.createChannel();
      }).then((channel) => {
        return channel.assertQueue(billingWorkerQueue).then(() => {
          return channel.sendToQueue(billingWorkerQueue, Buffer.from(JSON.stringify(transaction)));
        });
    }).catch(error => logger.error(error.message));
};