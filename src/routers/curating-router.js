import { Router } from "express";
import { CurationController } from "../controllers/curating-controller.js";

const router = Router();
const curationController = new CurationController();

router.post("/styles/:styleId/curations", curationController.postCurations);
router.get("/styles/:styleId/curations", curationController.getCurations);
router.put("/curations/:curationId",curationController.putCurations)     // 경로 재설정);
router.delete("/curations/:curationId",curationController.deleteCurations) // 경로 재설정);
              
export default router;