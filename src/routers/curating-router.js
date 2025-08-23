import express from 'express';
import { validate } from '../middlewares/validators-middleware.js';
import { createCurationSchema } from '../validators/curating-validator.js';
import { CurationController } from "../controllers/curating-controller.js";

const router = express.Router();
const controller = new CurationController();

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> b41f66e (1)
=======
>>>>>>> 847a58d (Feature/lsj (#2))
=======
>>>>>>> 5596d72 (khy edit)
router.post("/styles/:styleId/curations", curationController.postCurations);
router.get("/styles/:styleId/curations", curationController.getCurations);
router.put("/curations/:curationId",curationController.putCurations)     // 경로 재설정);
router.delete("/curations/:curationId",curationController.deleteCurations) // 경로 재설정);
=======
router.post("/:styleId/curations", curationController.createCuration);
router.get("/:styleId/curations", curationController.getCurations);
router.put("/curations/:curationId", curationController.putCuration);
router.delete("/curations/:curationId", curationController.deleteCuration);
>>>>>>> 47ae24d (khy edit)
=======
router.post("/styles/:styleId/curations", CurationController.postCurations);
router.get("/styles/:styleId/curations", CurationController.getCurations);
router.put("/curations/:curationId", CurationController.putCurations)
router.delete("/curations/:curationId", CurationController.deleteCurations) 
>>>>>>> e5a4550 (edit2)
              
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 50eaefa (edit controller (#10))
export default router;
=======
export default router;
=======
router.post("/:styleId/curations", curationController.createCuration);

router.get("/:styleId/curations", curationController.getCurations);

export default router;

>>>>>>> 6b1b4de (1)
>>>>>>> b41f66e (1)
=======
export default router;
>>>>>>> 847a58d (Feature/lsj (#2))
