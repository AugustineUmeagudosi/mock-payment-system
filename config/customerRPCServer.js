import amqp from 'amqplib/callback_api';
import { getCustomerById } from "../src/modules/customer/service";

const rabbitMQServer = process.env.NODE_ENV === 'test' ? process.env.RABBITMQ_SERVER : process.env.RABBITMQ_SERVER_REMOTE;
 
amqp.connect(rabbitMQServer, function(error0, connection) {
    if (error0) throw error0;

    connection.createChannel(async function(error1, channel) {
        if (error1) throw error1;

        const customerQueue = process.env.CUSTOMER_ENQUIRY_QUEUE;

        channel.assertQueue(customerQueue, { durable: true });
        channel.prefetch(1);
        logger.info('### Customer RPC server started ###');

        channel.consume(customerQueue, async function reply(msg) {
            if(msg !== null){
                const data = msg.content.toString();

                if (msg.properties.headers.method === 'getCustomerById') {
                    const customer = await getCustomerById(data);
                    let response = customer === null ? 'null' : customer;

                    channel.sendToQueue(msg.properties.replyTo,
                        Buffer.from(response.toString()), {
                            correlationId: msg.properties.correlationId
                        });
                }
                
                channel.ack(msg);
            }
            
        });
    });
});
