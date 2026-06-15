import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";

const recommendationRouter = Router();

recommendationRouter.use(authenticate);

export default recommendationRouter;
