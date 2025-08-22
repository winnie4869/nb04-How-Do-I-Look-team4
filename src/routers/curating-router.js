import { Router } from "express";
import { CurationController } from "../controllers/curating-controller.js";
import { validate } from '../middlewares/validators-middleware.js';
import { createCurationSchema } from '../validators/curating-validator.js';

const router = Router();
const curationController = new CurationController();

<<<<<<< HEAD
<<<<<<< HEAD
router.post("/:styleId/curations", curationController.createCuration);
router.get("/:styleId/curations", curationController.getCurations);
router.put("/curations/:curationId", curationController.putCuration);
router.delete("/curations/:curationId", curationController.deleteCuration);
              
    
=======
router.get("/styles/:styleId/curations", controller.getCurations.bind(controller));
router.post("/styles/:styleId/curations", validate(createCurationSchema), controller.postCurations.bind(controller));
router.put("/curations/:curationId", controller.putCurations.bind(controller));
router.delete("/curations/:curationId", controller.deleteCurations.bind(controller));
router.get("/curations/search", controller.searchCurations.bind(controller)) 
>>>>>>> 81da860 (first (#8))
=======
router.post("/:styleId/curations", curationController.createCuration);
router.get("/:styleId/curations", curationController.getCurations);
router.put("/curations/:curationId",     // 경로 재설정);
router.delete("/curations/:curationId", // 경로 재설정);
              
    
>>>>>>> 5f659fc (Feature/khy (#9))
export default router;