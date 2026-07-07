import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";

const chatbotRouter = Router();

chatbotRouter.use(authenticate);

export default chatbotRouter;
