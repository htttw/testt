import config from "../utils/config";
import createLogger from "../utils/logger";

const authMessage = {
  success: "Passed",
  error: "Unauthorized access",
};

const auth = (req: any, res: any, next: any) => {
  const { apiKey } = config;

  if (req.headers.id !== apiKey) {
    res.status(401).json({ message: authMessage.error });
    log(false, req);
    return;
  }

  log(true, req);
  return next();
};

const log = (authorized: boolean, req: any) => {
  createLogger[authorized ? "info" : "error"]({
    url: req.originalUrl,
    method: req.method,
    body: req.method === "POST" ? req.body : "",
    params: req.method !== "POST" ? req.params : "",
    query: req.method === "GET" ? req.query : "",
    message: authorized ? authMessage.success : authMessage.error,
  });
};

export default auth;
