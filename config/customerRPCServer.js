import amqp from 'amqplib/callback_api';
import { getCustomerById } from "../src/modules/customer/service";
 
amqp.connect(process.env.RABBITMQ_SERVER, function(error0, connection) {
    if (error0) throw error0;

    connection.createChannel(async function(error1, channel) {
        if (error1) throw error1;

        const customerQueue = process.env.CUSTOMER_ENQUIRY_QUEUE;

        channel.assertQueue(customerQueue, { durable: true });
        channel.prefetch(1);
        logger.info('### Customer RPC server started ###');

        channel.consume(customerQueue, async function reply(msg) {
            logger.info('### Customer RPC server invoked ###');

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
