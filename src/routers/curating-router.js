import express from 'express';
import { validate } from '../middlewares/validators-middleware.js';
import { createCurationSchema } from '../validators/curating-validator.js';
import { CurationController } from "../controllers/curating-controller.js";

const router = express.Router();
const controller = new CurationController();

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
export default router;