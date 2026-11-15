import { Router } from "express";
import {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getStats,
  seedMedicines
} from "../controllers/medicineController.js";

const router = Router();

// Stats endpoint
router.get("/stats", getStats);

// Seed endpoint
router.post("/medicines/seed", seedMedicines);

// Core CRUD endpoints
router.route("/medicines")
  .get(getMedicines)
  .post(createMedicine);

router.route("/medicines/:id")
  .get(getMedicineById)
  .put(updateMedicine)
  .delete(deleteMedicine);

export default router;
