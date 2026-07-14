import express from "express";

import {
  createProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProperty);

router.get("/", protect, getAllProperties);

router.get("/:id", protect, getSingleProperty);

router.put("/:id", protect, updateProperty);

router.delete("/:id", protect, deleteProperty);

export default router;