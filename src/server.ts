import config from "./utils/config";
import createLogger from "./utils/logger";
import app from "./app";

const { env, apiPort } = config;

app.listen(apiPort);
createLogger.info(`API running on ${env}`);
createLogger.info(`API listening port ${apiPort}`);
