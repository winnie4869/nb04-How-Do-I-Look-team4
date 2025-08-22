import { Router } from "express";
import { CurationController } from "../controllers/curating-controller.js";
import { validate } from '../middlewares/validators-middleware.js';
import { createCurationSchema } from '../validators/curating-validator.js';

const router = Router();
const curationController = new CurationController();

router.post("/:styleId/curations", curationController.createCuration);
router.get("/:styleId/curations", curationController.getCurations);
router.put("/curations/:curationId",     // 경로 재설정);
router.delete("/curations/:curationId", // 경로 재설정);
              
    
export default router;