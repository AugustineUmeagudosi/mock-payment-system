import { processTransaction } from '../../../src/modules/billingWorker/service'
class BillingWorker {
  static async processTransaction({ data }, done){
    try {
      const { transaction } = data;
      transaction.status = 'approved';
      await processTransaction(transaction);
      
      done();
    } catch (e) {
      logger.error(`##### Billing worker job failed #####`);
      done(e);
    }
  }
}

export default BillingWorker;
