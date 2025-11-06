import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { productService } from "./product.service";

const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await productService.getAllProducts(req);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Product retrieved successfully",
      data: products,
    });
  }
);

const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await productService.createProduct(req);

    res.status(201).json({
      status: 201,
      success: true,
      message: "Product created successfully",
      data: product,
    });
  }
);

const editProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await productService.editProduct(req);

    res.status(201).json({
      status: 201,
      success: true,
      message: "Product edited successfully",
      data: product,
    });
  }
);

const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await productService.deleteProduct(req);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  }
);

export const productController = {
  createProduct,
  getAllProducts,
  deleteProduct,
  editProduct,
};
