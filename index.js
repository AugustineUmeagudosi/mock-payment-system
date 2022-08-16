import express from 'express';
import appPackage from './package.json';
import expressConfig from './config/expressConfig'; 
import 'dotenv/config';
import './config/db_connection';
import { billingWorker } from "./src/modules/billingWorker/service";
import { customerEnquiry } from "./src/modules/customer/service";

const port = process.env.PORT || 2000;
const app = express();

app.set('APP_PACKAGE', {
  name: appPackage.name,
  version: appPackage.version,
});

expressConfig(app);
billingWorker(); // starts the billingWorker consumer
customerEnquiry();  // starts the customer service consumer

app.listen(port, () => logger.info(`App listening on port ${port}...`));

export default app;