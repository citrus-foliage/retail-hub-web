import express from "express";
import {
  getProfile,
  updateProfile,
  deleteAccount,
  toggleWishlist,
  getWishlist,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteAccount);
router.get("/wishlist", protect, getWishlist);
router.put("/wishlist/:productId", protect, toggleWishlist);

export default router;
