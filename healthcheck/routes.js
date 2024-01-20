"use strict";
const checks = require("./checks");
const outputs = require("./outputs");
const versionFile = require("./versionFile");

const { Logger } = require("@hmcts/nodejs-logging");
const logger = Logger.getLogger("@hmcts/nodejs-logging/routes");

function checkLiveness(livenessChecks = {}) {
  const check = new checks.CompositeCheck(livenessChecks);

  return (req, res) => {
    return Promise.resolve(check.call(req, res)).then((results) => {
      const allOk = Object.values(results).every(
        (result) => result.status === outputs.UP
      );
      const output = Object.assign(outputs.status(allOk), results);
      const status = allOk ? 200 : 500;
      if (!allOk) {
        const downHealthChecks = Object.values(results).filter(
          (result) => result.status === outputs.DOWN
        );

        logger.error(
          "Health check failed, result for down endpoints: ",
          JSON.stringify(downHealthChecks)
        );
      }
      res.status(status).json(output);
    });
  };
}

function checkReadiness(readinessChecks = {}) {
  const check = new checks.CompositeCheck(readinessChecks);

  return (req, res) => {
    return Promise.resolve(check.call(req, res)).then((results) => {
      const allOk = Object.values(results).every(
        (result) => result.status === outputs.UP
      );
      const output = Object.assign(outputs.status(allOk), results);
      const status = allOk ? 200 : 500;
      if (!allOk) {
        const downHealthChecks = Object.values(results).filter(
          (result) => result.status === outputs.DOWN
        );

        logger.error(
          "Health check failed, result for down endpoints: ",
          JSON.stringify(downHealthChecks)
        );
      }
      res.status(status).json(output);
    });
  };
}

module.exports = {
  checkReadiness,
  checkLiveness,
};
