/* istanbul ignore file */
import Queue from 'bull';
import jobEvents from './events';

export const queue = process.env.NODE_ENV === 'test'
  ? new Queue('PaymentTestJobs', 'redis://127.0.0.1:6379')
  : new Queue('PaymentJobs', 'redis://127.0.0.1:6379');

queue.setMaxListeners(queue.getMaxListeners() + 100);

jobEvents(queue);

export const createJob = (options) => {
  const opts = { priority: 0, attempts: 5, ...options };
  queue.add(opts.type, opts.data, {
    attempts: opts.attempts,
    backoff: {
      type: 'exponential',
    },
    removeOnComplete: true,
    removeOnFail: true,
    delay: opts.delay
  });
};

// Queue Events

// Fires when a job is added to queue
queue.on('active', ({ id, name }) => {
  logger.info(`The job ${id} of name: ${name} got added to queue`);
});

// Fires when a job is done with.
queue.on('completed', ({ id }) => {
  logger.info(`Job with the id: ${id} just completed`);
});

// Fires when a job fails after a certain retry.
queue.on('failed', ({ id, attemptsMade }, err) => {
  if (logger) {
    logger.info(
      `Job of id: ${id} failed with the message: ${err.message} after ${attemptsMade} attempts`
    );
  }
});
