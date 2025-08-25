import { Router } from 'express';
import { CurationController } from "../controllers/curating-controller.js";

const router = Router();
const curationController = new CurationController();


router.post("/styles/:styleId/curations",curationController.postCurations);
router.get("/styles/:styleId/curations", curationController.getCurations);
router.put("/curations/:curationId",curationController.putCurations);    
router.delete("/curations/:curationId",curationController.deleteCurations);
            
export default router;
