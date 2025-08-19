import express from 'express';
import { validate } from '../middlewares/validators-middleware.js';
import { createCurationSchema } from '../validators/curating-validator.js';
import { CurationController } from "../controllers/curating-controller.js";

const router = express.Router();
const controller = new CurationController();

router.post("/:styleId/curations", curationController.createCuration);
router.get("/:styleId/curations", curationController.getCurations);
router.put("/curations/:curationId", curationController.putCuration);
router.delete("/curations/:curationId", curationController.deleteCuration);
              
    
export default router;