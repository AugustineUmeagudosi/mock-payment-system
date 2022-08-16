import { connect } from 'amqplib';

const connection = connect(process.env.RABBITMQ_SERVER);
const billingWorkerQueue = process.env.BILLING_WORKER_QUEUE;

export const billingWorker = () => {
    connection.then((conn) => {
        return conn.createChannel();
    }).then((channel) => {
        return channel.assertQueue(billingWorkerQueue).then(() => {
            return channel.consume(billingWorkerQueue, (msg) => {
                if (msg !== null) {
                    const transaction = JSON.parse(msg.content.toString());
                    channel.ack(msg);
                    channel.close();

                    // create job here with transaction
                }
            });
        });
    }).catch(error => logger.error(error.message));
}; 