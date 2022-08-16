import welcomeRoutes from './modules/welcome/router';
import billingRoutes from './modules/billing/router';

const routes = (app) => {
  app.use(`/`, welcomeRoutes);
  app.use(`/billing`, billingRoutes);
};

export default routes;
