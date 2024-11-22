/**
 * guest router
 */

import { factories } from "@strapi/strapi";
const defaultRouter = factories.createCoreRouter("api::guest.guest");

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const extraRoutes = [
  {
    method: "GET",
    path: "/guests-with-sub-guests", // Ruta personalizada
    handler: "guest.findWithSubGuests", // Controlador y método
  },
];

module.exports = customRouter(defaultRouter, extraRoutes);
