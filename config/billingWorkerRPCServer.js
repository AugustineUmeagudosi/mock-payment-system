import amqp from 'amqplib/callback_api';

amqp.connect(process.env.RABBITMQ_SERVER, function(error0, connection) {
    if (error0) throw error0;

    connection.createChannel(function(error1, channel) {
        if (error1) throw error1;

        const billingWorkerQueue = process.env.BILLING_WORKER_QUEUE;

        channel.assertQueue(billingWorkerQueue, { durable: true });
        channel.prefetch(1);
        logger.info('### Billing Worker RPC server started ###');

        channel.consume(billingWorkerQueue, async function reply(msg) {
            const data = parseInt(msg.content.toString());
            // to do
            // decode using info on data.method and call the concerned service and save the result in r

            channel.sendToQueue(msg.properties.replyTo,
                Buffer.from(r.toString()), {
                    correlationId: msg.properties.correlationId
                });

            channel.ack(msg);
        });
    });
});