import amqp from 'amqplib/callback_api';
import { approveTransaction } from "../src/modules/billing/service";

const rabbitMQServer = process.env.NODE_ENV === 'test' ? process.env.RABBITMQ_SERVER : process.env.RABBITMQ_SERVER_REMOTE;

amqp.connect(rabbitMQServer, function(error0, connection) {
    if (error0) throw error0;

    connection.createChannel(function(error1, channel) {
        if (error1) throw error1;

        const billingQueue = process.env.BILLING_QUEUE;

        channel.assertQueue(billingQueue, { durable: true });
        channel.prefetch(1);
        logger.info('### Billing RPC server started ###');

        channel.consume(billingQueue, async function reply(msg) {
            if(msg !== null){
                const data = msg.content.toString();

                if (msg.properties.headers.method === 'approveTransaction') {
                    await approveTransaction(data);
                    const response = 'success';

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