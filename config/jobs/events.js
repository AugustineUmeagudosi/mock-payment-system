import BillingWorker from './worker/billingWorker';

const billingWorker = process.env.BILLING_WORKER_EVENT;
export default (queue) => {
  queue.process(billingWorker, BillingWorker.processTransaction);
};
