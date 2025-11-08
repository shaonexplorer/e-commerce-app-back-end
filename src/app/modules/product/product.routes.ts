import express from "express";
import { productController } from "./product.controller";
import { authenticate } from "../../middleware/authenticate";
import { upload } from "../../config/multer";
import { zodValidation } from "../../middleware/zodValidation";
import {
  createProductZodSchema,
  updateProductZodSchema,
} from "./product.validation";

const router = express.Router();

router.get("/", authenticate(["SELLER"]), productController.getAllProducts);

router.post(
  "/create",
  upload.array("images", 5),
  authenticate(["ADMIN", "SELLER"]),
  zodValidation(createProductZodSchema),
  productController.createProduct
);

router.patch(
  "/:id",
  upload.array("images", 5),
  authenticate(["ADMIN", "SELLER"]),
  zodValidation(updateProductZodSchema),
  productController.editProduct
);

router.delete(
  "/:id",
  authenticate(["ADMIN", "SELLER"]),
  productController.deleteProduct
);

export const productRoutes = router;
