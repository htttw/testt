import { Router } from "express";

import {
  validateController,
} from "../controllers/user";

const UserRouter = Router();
UserRouter.post("/validate", validateController); 

export default UserRouter;
