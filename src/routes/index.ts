import { Router } from "express";
import authRouter from "../modules/auth/auth.routes";
import chatbotRouter from "../modules/chatbot/chatbot.routes";
import profileRouter from "../modules/profiles/profile.routes";
import recommendationRouter from "../modules/recommendations/recommendation.routes";
import schemeRouter from "../modules/schemes/scheme.routes";
import searchRouter from "../modules/search/search.routes";


import ingestionRouter from "../modules/ingestion/ingestion.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/profiles", profileRouter);
apiRouter.use("/schemes", schemeRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/recommendations", recommendationRouter);
apiRouter.use("/chatbot", chatbotRouter);
apiRouter.use("/ingestion", ingestionRouter);

export default apiRouter;
