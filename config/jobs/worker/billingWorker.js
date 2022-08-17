/**
 * A collection of worker methods tha handles event related to videos.
 *
 * @class VideoWorker
 */
class BillingWorker {
  static async processTransaction({ data }, done){
    try {
      const { transaction } = data;
      logger.info(transaction);

      logger.info(`##### transaction with the id ${transaction.id} approved #####`);
      done();
    } catch (e) {
      logger.error(`##### Billing worker job failed #####`);
      done(e);
    }
  }
}

export default BillingWorker;
