const express = require("express");
const {
  createProduct,
  getProduct,
  getProductPhoto,
  deleteProduct,
  updateProduct,
  order,
  allOrder,
  updateStatus,
} = require("../controller/productController");
const { requireSignin, checkRole } = require("../middlewares/atuhMiddleware");
const productRouter = express.Router();
const formidableMiddleware = require("express-formidable");

productRouter.post("/create-product", formidableMiddleware(), createProduct);

productRouter.put(
  "/update-product/:pid",
  requireSignin,
  checkRole,
  formidableMiddleware(),
  updateProduct
);

productRouter.get("/get-product", getProduct);

productRouter.get("/product-photo/:pid", getProductPhoto);

productRouter.delete("/delete-product/:pid", deleteProduct);

productRouter.get("/your-order/:id", order);

productRouter.get("/all-order/", requireSignin, checkRole, allOrder);

productRouter.put(
  "/update-order/:orderId",
  requireSignin,
  checkRole,
  updateStatus
);

module.exports = {
  productRouter,
};
