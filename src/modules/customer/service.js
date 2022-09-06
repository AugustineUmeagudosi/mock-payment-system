import { Sequelize, Customer } from "../../../models";
import { customerDetails } from "../../utils/constants";
import { connect } from 'amqplib';


const customerEnquiryQueue = process.env.CUSTOMER_ENQUIRY_QUEUE;
const customerEnquiryResponseQueue = process.env.CUSTOMER_ENQUIRY_RESPONSE_QUEUE;
const rabbitMQServer = process.env.NODE_ENV === 'test' ? process.env.RABBITMQ_SERVER : process.env.RABBITMQ_SERVER_REMOTE;
const connection = connect(rabbitMQServer);

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
                    // channel.ack(msg);
                    channel.close();

                    return postCustomerEnquiryResponse(customerId);
                }
            });
        });
    }).catch(error => logger.error(error.message));
};

export const getCustomerById = (id) => {
    return Customer.findOne({ where: { id }, attributes: customerDetails })
        .catch(error => logger.error(error.message));
};

export const seedCustomer = async(customer) => {
    const customerExists = await getCustomerById(customer.id);
    if (!customerExists) return Customer.create(customer) .catch(error => logger.error(error.message));
};