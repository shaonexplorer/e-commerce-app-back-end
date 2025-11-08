import { Request } from "express";
import { prisma } from "../../config/prisma";
import cloudinary from "../../config/cloudinary";
import fs from "fs";

const getAllProducts = async (req: Request & { user?: any }) => {
  const id = req.user.userId;
  const products = await prisma.product.findMany({ where: { sellerId: id } });
  return products;
};

const createProduct = async (req: Request & { user?: any }) => {
  const images = req.files as Express.Multer.File[] | undefined;

  const buffers = images?.map((file) => file.buffer);

  const uploadToCloudinary = (buffer: Buffer) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream((error, uploadResult) => {
          if (error) {
            return reject(error);
          }
          return resolve(uploadResult);
        })
        .end(buffer);
    });
  };

  const uploadResult = buffers?.map((buffer) => uploadToCloudinary(buffer));

  const result = await Promise.all(uploadResult as any);

  console.log({ result });

  let imageUrls: string[] = [];

  if (result.length) {
    imageUrls = result.map((img) => img.secure_url);
  }

  const product = await prisma.product.create({
    data: {
      ...req.body,
      price: parseFloat(req.body.price),
      quantity: parseInt(req.body.quantity),
      images: imageUrls,
      sellerId: req.user?.userId,
    },
  });

  return product;
};

const deleteProduct = async (req: Request) => {
  const id = req.params.id;
  const product = await prisma.product.delete({
    where: { id: id },
  });
  return product;
};

const editProduct = async (req: Request) => {
  const id = req.params.id;

  const images = req.files as Express.Multer.File[] | undefined;

  const uploads = images?.map((file) => {
    return cloudinary.uploader.upload(file.path);
  });

  const cloudinaryImages = await Promise.all(uploads || []);

  let imageUrls: string[] = [];

  if (cloudinaryImages.length) {
    imageUrls = cloudinaryImages.map((img) => img.secure_url);
  }

  const local = images?.forEach((file) => {
    fs.unlinkSync(file.path);
  });

  await Promise.all(local || []);

  const product = await prisma.product.update({
    where: { id: id },
    data: { ...req.body, ...(imageUrls.length > 0 && { images: imageUrls }) },
  });
  return product;
};

export const productService = {
  createProduct,
  getAllProducts,
  deleteProduct,
  editProduct,
};
