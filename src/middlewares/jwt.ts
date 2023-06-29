import jwt from "jsonwebtoken";

import config from "../utils/config";
import createLogger from "../utils/logger";

const authMessage = {
  success: "Token OK",
  error: "Invalid token",
};

const validateToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization;
  jwt.verify(token, config.secret, (err: any) => {
    if (err) {
      res.status(401).json({ message: authMessage.error });
      log(false, req);
      return;
    }
    log(true, req);
    return next();
  });
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

export default validateToken;
