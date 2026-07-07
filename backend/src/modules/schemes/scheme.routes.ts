import { Router } from 'express';
import { SchemeController } from './scheme.controller';
import { validate } from '../../middleware/validate.middleware';
import { createSchemeSchema } from './scheme.validation';

const schemeRouter = Router();

schemeRouter.post(
  '/', 
  validate(createSchemeSchema), 
  SchemeController.createScheme
);

schemeRouter.get('/', SchemeController.getSchemes);
schemeRouter.get('/:id', SchemeController.getSchemeById);

export default schemeRouter;
