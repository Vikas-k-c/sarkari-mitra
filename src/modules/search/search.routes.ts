import { Router } from 'express';
import { SearchController } from './search.controller';
import { validate } from '../../middleware/validate.middleware';
import { searchSchema } from './search.validation';

const searchRouter = Router();

searchRouter.get('/', validate(searchSchema, 'query'), SearchController.search);

export default searchRouter;
