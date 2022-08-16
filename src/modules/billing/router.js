import { Router } from 'express';
import * as Validate from '../../middlewares/validate';
import * as Controller from './controller';
import * as Schema from './schema';

const { validateData } = Validate;
const { transaction } = Schema;
const router = Router();

router.post('/', validateData(transaction), Controller.creditAccount);

export default router;