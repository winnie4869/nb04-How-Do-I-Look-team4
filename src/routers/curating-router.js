import express from 'express';
import { validate } from '../middlewares/validators-middleware.js';
import { createCurationSchema } from '../validators/curating-validator.js';
import { CurationController } from "../controllers/curating-controller.js";

const router = express.Router();
const controller = new CurationController();

router.post("/:styleId/curations", curationController.createCuration);
router.get("/:styleId/curations", curationController.getCurations);
router.put("/:styleId/curations/:curationId", curationController.put..);
router.delete("/:styleId/curations/:curationId", curationController.delete...);
              
    
export default router;