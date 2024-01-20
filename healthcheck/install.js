"use strict";

const routes = require("./routes");

function addTo(app, config) {
  app.get("/health/livez", routes.checkLiveness(config.livez));
  app.get("/health/readyz", routes.checkReadiness(config.readyz));
}

module.exports = {
  addTo: addTo,
};
