import { Router } from 'express';
import * as siteController from '../controllers/siteController.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/site', siteController.getPublicSite);

export default router;
