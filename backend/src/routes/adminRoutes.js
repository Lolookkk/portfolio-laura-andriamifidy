import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';
import * as siteController from '../controllers/siteController.js';
import * as pageController from '../controllers/pageController.js';
import * as sectionController from '../controllers/sectionController.js';
import * as itemController from '../controllers/itemController.js';
import * as categoryController from '../controllers/categoryController.js';
import * as settingController from '../controllers/settingController.js';

const router = Router();

// Toutes les routes admin exigent une authentification + rôle admin.
router.use(requireAuth, requireAdmin);

// Contenu complet (brouillons inclus)
router.get('/site', siteController.getAdminSite);

// Pages
router.post('/pages', pageController.createPage);
router.patch('/pages/:id', pageController.updatePage);
router.delete('/pages/:id', pageController.deletePage);

// Sections
router.post('/sections', sectionController.createSection);
router.patch('/sections/:id', sectionController.updateSection);
router.delete('/sections/:id', sectionController.deleteSection);

// Items
router.post('/items', itemController.createItem);
router.patch('/items/:id', itemController.updateItem);
router.delete('/items/:id', itemController.deleteItem);

// Catégories
router.post('/categories', categoryController.createCategory);
router.patch('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// Paramètres
router.get('/settings', settingController.getSettings);
router.put('/settings', settingController.putSettings);

export default router;
