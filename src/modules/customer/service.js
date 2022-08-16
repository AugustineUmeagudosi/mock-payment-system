import { Sequelize, Customer } from "../../../models";
import { customerDetails } from "../../utils/constants";
import { connect } from 'amqplib';

const connection = connect(process.env.RABBITMQ_SERVER);
const customerEnquiryQueue = process.env.CUSTOMER_ENQUIRY_QUEUE;
const customerEnquiryResponseQueue = process.env.CUSTOMER_ENQUIRY_RESPONSE_QUEUE;

export const createCustomer = (customer) => {
    return  Customer.create(customer)
        .catch(error => logger.error(error.message));
};

// listens for customer enquiry requests
export const customerEnquiry = () => {
    connection.then((conn) => {
        return conn.createChannel();
    }).then((channel) => {
        return channel.assertQueue(customerEnquiryQueue).then(() => {
            return channel.consume(customerEnquiryQueue, (msg) => {
                if (msg !== null) {
                    const customerId = JSON.parse(msg.content.toString());
                    channel.ack(msg);
                    channel.close();

                    postCustomerEnquiryResponse(customerId)
                }
            });
        });
    }).catch(error => logger.error(error.message));
};

// sends out customer enquiry response to the queue
export const postCustomerEnquiryResponse = async(customerId) => {
    const customer = await Customer.findOne({ where: { id: customerId }, attributes: customerDetails })
        .catch(error => logger.error(error.message));

    connection.then((conn) => {
        return conn.createChannel();
      }).then((channel) => {
        return channel.assertQueue(customerEnquiryResponseQueue).then(() => {
          return channel.sendToQueue(customerEnquiryResponseQueue, Buffer.from(JSON.stringify(customer)));
        });
    }).catch(error => logger.error(error.message));
}