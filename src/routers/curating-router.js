import { Router } from "express";
import { CurationController } from "../controllers/curating-controller.js";

const router = Router();
const curationController = new CurationController();

router.post("/:styleId/curations", curationController.createCuration);

router.get("/:styleId/curations", curationController.getCurations);

export default router;

