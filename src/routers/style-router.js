import express from 'express';
import StyleController from '../controllers/style-controller.js';

const router = express.Router();
const styleController = new StyleController();

router.post('/styles', styleController.createStyle);
router.get('/styles', styleController.getStyles);
router.get('/styles/:styleId', styleController.getStyleById);
router.put('/styles/:styleId', styleController.updateStyle);
router.delete('/styles/:styleId', styleController.deleteStyle);

export default router;
