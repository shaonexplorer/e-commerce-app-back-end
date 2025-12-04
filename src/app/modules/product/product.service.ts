import { Request } from "express";
import { prisma } from "../../config/prisma";
import cloudinary from "../../config/cloudinary";

const getPublicProducts = async (req: Request) => {
  const { searchTerm } = req.query;

  const whereCondition = [];

  if (searchTerm) {
    whereCondition.push({ title: { contains: searchTerm as string } });
  } else {
    whereCondition.push({ title: "" });
  }

  const products = await prisma.product.findMany({
    where: { OR: whereCondition },
    orderBy: { createdAt: "desc" },
  });
  return products;
};

const getAllProducts = async (req: Request & { user?: any }) => {
  const id = req.user.userId;
  const products = await prisma.product.findMany({
    where: { sellerId: id },
    orderBy: { createdAt: "desc" },
  });
  return products;
};

const getProductById = async (req: Request) => {
  const id = req.params.id;
  const product = await prisma.product.findUniqueOrThrow({
    where: { id },
  });
  return product;
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

  // const uploads = images?.map((file) => {
  //   return cloudinary.uploader.upload(file.path);
  // });

  // const cloudinaryImages = await Promise.all(uploads || []);

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

  // if (cloudinaryImages.length) {
  //   imageUrls = cloudinaryImages.map((img) => img.secure_url);
  // }

  if (result.length) {
    imageUrls = result.map((img) => img.secure_url);
  }

  // const local = images?.forEach((file) => {
  //   fs.unlinkSync(file.path);
  // });

  // await Promise.all(local || []);

  if (req.body.existingImages) {
    imageUrls = [...req.body.existingImages, ...imageUrls];
  }

  const { existingImages, ...payload } = req.body;

  const product = await prisma.product.update({
    where: { id: id },
    data: { ...payload, ...(imageUrls.length > 0 && { images: imageUrls }) },
  });
  return product;
};

export const productService = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  editProduct,
  getPublicProducts,
};
