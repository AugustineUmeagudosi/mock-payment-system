import amqp from 'amqplib/callback_api';
import { v4 as uuidv4 } from 'uuid';

const billingQueue = process.env.BILLING_QUEUE;
const transactionApprovalResponseQueue = process.env.TANSACTION_APPROVAL_RESPONSE_QUEUE;

export const processTransaction = (transaction) => {
    amqp.connect(process.env.RABBITMQ_SERVER, function(error0, connection) {
        if (error0) throw error0;

        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            channel.assertQueue(transactionApprovalResponseQueue, {
                exclusive: false
            }, function(error2, q) {
                if (error2) throw error2;

                const correlationId = uuidv4();
    
                channel.consume(q.queue, async function(msg) {
                    if (msg.properties.correlationId === correlationId) {
                        channel.ack(msg);
                        channel.close(); 

                        if(msg.content.toString() === 'success')
                            return logger.info(`##### transaction with the id ${transaction.id} was approved #####`);
                        return logger.error(`##### Billing worker job for ${transaction.id} failed #####`);
                    }
                }, {
                    noAck: true
                });
    
                channel.sendToQueue(billingQueue,
                    Buffer.from(transaction.id.toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {method: 'approveTransaction'}
                    });
            });
        });
    });
};