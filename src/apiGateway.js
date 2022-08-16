import welcomeRoutes from './modules/welcome/router';

const routes = (app) => {
  app.use(`/`, welcomeRoutes);
};

export default routes;
