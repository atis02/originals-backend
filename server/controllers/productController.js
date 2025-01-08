const {
  Product,
  ProductColorDetails,
  Category,
  SizeTable,
  Size,
} = require("../models/model");
const ApiError = require("../error/apiError");
const sequelize = require("../database");
const { Op } = require("sequelize");

class ProductController {
  async create(req, res, next) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      const { productDetail, colorDetail } = req.body;
      const parsedProductDetails = JSON.parse(productDetail);
      const parsedColorDetails = JSON.parse(colorDetail || "[]");

      // Ensure all required fields are present for both product and color details
      const requiredFields = [
        "nameTm",
        "nameRu",
        "nameEn",
        "descriptionTm",
        "descriptionRu",
        "descriptionEn",
        "sellPrice",
        "incomePrice",
        "productQuantity",
        "productColorId",
        "sizeTableId",
        "sizesWithQuantities", // sizes and quantities
      ];
      const requiredFieldsProduct = [
        "nameTm",
        "nameRu",
        "nameEn",
        "barcode",
        "categoryId",
        "subCategoryId",
      ];

      // Validate required fields for color details
      for (const field of requiredFields) {
        if (!parsedColorDetails[0][field]) {
          return next(
            ApiError.badRequest(`${field} in product color detail is required`)
          );
        }
      }

      // Validate required fields for product
      for (const field of requiredFieldsProduct) {
        if (!parsedProductDetails[field]) {
          return next(ApiError.badRequest(`${field} in product is required`));
        }
      }

      // Parse the images from the request
      const minImagePath = req.files?.minImage?.[0]?.filename
        ? `/static/${req.files.minImage[0].filename}`
        : null;
      const hoverImagePath = req.files?.hoverImage?.[0]?.filename
        ? `/static/${req.files.hoverImage[0].filename}`
        : null;
      const fullImagePaths =
        req.files?.fullImages?.map((file) => `/static/${file.filename}`) || [];

      // Create the product
      const product = await Product.create(
        {
          nameTm: parsedProductDetails.nameTm,
          nameRu: parsedProductDetails.nameRu,
          nameEn: parsedProductDetails.nameEn,
          barcode: parsedProductDetails.barcode,
          categoryId: parsedProductDetails.categoryId,
          subCategoryId: parsedProductDetails.subCategoryId,
          // isActive: isActive || true, // Uncomment if needed
        },
        { transaction }
      );

      // If color details exist, create them
      if (parsedColorDetails.length) {
        const colorDetailsData = parsedColorDetails.map((detail) => ({
          ...detail,
          productId: product.id,
          minImage: minImagePath,
          hoverImage: hoverImagePath,
          fullImages: fullImagePaths,
          sizesWithQuantities: detail.sizesWithQuantities || [], // Ensure sizes with quantities are included
        }));

        await ProductColorDetails.bulkCreate(colorDetailsData, { transaction });
      }

      await transaction.commit();

      return res.status(201).json({
        product,
        message: "Product and color details created successfully",
      });
    } catch (error) {
      await transaction.rollback(); // Rollback on error
      console.error("Error creating product:", error);
      return next(
        ApiError.badRequest(`Failed to create product: ${error.message}`)
      );
    }
  }

  async addColorDetail(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { productId, colorDetail } = req.body;

      let parsedColorDetail;
      try {
        parsedColorDetail = JSON.parse(colorDetail);
      } catch (error) {
        return next(
          ApiError.badRequest("Invalid JSON format for color detail")
        );
      }

      // Validate required fields
      const requiredFields = [
        "nameTm",
        "nameRu",
        "nameEn",
        "descriptionTm",
        "descriptionRu",
        "descriptionEn",
        "sellPrice",
        "incomePrice",
        "productQuantity",
      ];

      for (const field of requiredFields) {
        if (!parsedColorDetail[field]) {
          return next(ApiError.badRequest(`${field} is required`));
        }
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        return next(ApiError.badRequest("Product not found"));
      }

      const minImagePath = req.files?.minImage?.[0]?.filename
        ? `/static/${req.files.minImage[0].filename}`
        : null;

      const hoverImagePath = req.files?.hoverImage?.[0]?.filename
        ? `/static/${req.files.hoverImage[0].filename}`
        : null;

      const fullImagePaths =
        req.files?.fullImages?.map((file) => `/static/${file.filename}`) || [];

      if (!minImagePath || !hoverImagePath) {
        return next(
          ApiError.badRequest("Both minImage and hoverImage are required")
        );
      }

      const newColorDetail = {
        ...parsedColorDetail,
        productId,
        minImage: minImagePath,
        hoverImage: hoverImagePath,
        fullImages: fullImagePaths,
      };

      const createdColorDetail = await ProductColorDetails.create(
        newColorDetail,
        { transaction }
      );
      await transaction.commit();

      return res.status(201).json({
        message: "Color detail added successfully",
        data: createdColorDetail,
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error adding color detail:", error);
      return next(ApiError.badRequest(error.message));
    }
  }

  async update(req, res, next) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      const { productId, productColorId, productDetail, colorDetails } =
        req.body;
      const parsedProductDetails = JSON.parse(productDetail);
      const parsedColorDetails = JSON.parse(colorDetails || "[]");

      // Ensure all required fields are present for both product and color details
      const requiredFields = [
        "nameTm",
        "nameRu",
        "nameEn",
        "descriptionTm",
        "descriptionRu",
        "descriptionEn",
        "sellPrice",
        "incomePrice",
        "productQuantity",
        // "productColorId",
        "sizesWithQuantities", // sizes and quantities
      ];
      const requiredFieldsProduct = [
        "nameTm",
        "nameRu",
        "nameEn",
        "barcode",
        "categoryId",
        "subCategoryId",
      ];

      // Validate required fields for color details
      for (const field of requiredFields) {
        if (!parsedColorDetails[0][field]) {
          return next(
            ApiError.badRequest(`${field} in product color detail is required`)
          );
        }
      }

      // Validate required fields for product
      for (const field of requiredFieldsProduct) {
        if (!parsedProductDetails[field]) {
          return next(ApiError.badRequest(`${field} in product is required`));
        }
      }

      // Check if product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return next(ApiError.badRequest("Product not found"));
      }

      // Parse the images from the request if provided
      const minImagePath = req.files?.minImage?.[0]?.filename
        ? `/static/${req.files.minImage[0].filename}`
        : null;
      const hoverImagePath = req.files?.hoverImage?.[0]?.filename
        ? `/static/${req.files.hoverImage[0].filename}`
        : null;
      const fullImagePaths =
        req.files?.fullImages?.map((file) => `/static/${file.filename}`) || [];

      // Update the product details
      await product.update(
        {
          nameTm: parsedProductDetails.nameTm,
          nameRu: parsedProductDetails.nameRu,
          nameEn: parsedProductDetails.nameEn,
          barcode: parsedProductDetails.barcode,
          categoryId: parsedProductDetails.categoryId,
          subCategoryId: parsedProductDetails.subCategoryId,
        },
        { transaction }
      );

      // If color details exist, update them
      if (parsedColorDetails.length) {
        for (const detail of parsedColorDetails) {
          const existingColorDetail = await ProductColorDetails.findOne({
            where: {
              productId: product.id,
              //   productColorId: productColorId,
            },
          });

          // If the color detail doesn't exist, create a new one
          if (!existingColorDetail) {
            await ProductColorDetails.create(
              {
                ...detail,
                productId: product.id,
                minImage: minImagePath,
                hoverImage: hoverImagePath,
                fullImages: fullImagePaths,
                sizesWithQuantities: detail.sizesWithQuantities || [],
              },
              { transaction }
            );
          } else {
            // If color detail exists, update it
            await existingColorDetail.update(
              {
                ...detail,
                minImage: minImagePath || existingColorDetail.minImage,
                hoverImage: hoverImagePath || existingColorDetail.hoverImage,
                fullImages: fullImagePaths.length
                  ? fullImagePaths
                  : existingColorDetail.fullImages,
                sizesWithQuantities: detail.sizesWithQuantities || [],
              },
              { transaction }
            );
          }
        }
      }

      // Commit the transaction
      await transaction.commit();

      return res.status(200).json({
        message: "Product and color details updated successfully",
        product, // Return the updated product
      });
    } catch (error) {
      await transaction.rollback(); // Rollback on error
      console.error("Error updating product:", error);
      return next(
        ApiError.badRequest(`Failed to update product: ${error.message}`)
      );
    }
  }

  async getAll(req, res, next) {
    try {
      const filter = {};
      const {
        categoryId,
        subCategoryId,
        minPrice,
        maxPrice,
        nameTm,
        sortBy = "createdAt", // Default sorting by creation date
        sortOrder = "DESC", // Default descending order
        page = 1,
        limit = 10,
      } = req.query;

      const offset = (page - 1) * limit;

      const whereConditions = {};

      // Handle category filter
      if (categoryId) {
        whereConditions.categoryId = categoryId;
      }

      // Handle subCategory filter
      if (subCategoryId) {
        whereConditions.subCategoryId = subCategoryId;
      }

      if (maxPrice || minPrice) {
        const priceCondition = [];
        if (maxPrice) {
          priceCondition.push({ [Op.lte]: maxPrice });
        }
        if (minPrice) {
          priceCondition.push({ [Op.gte]: minPrice });
        }
        filter.sellPrice = { [Op.and]: priceCondition };
      }

      // Handle name filter
      if (nameTm) {
        whereConditions.nameTm = {
          [Op.iLike]: `%${nameTm}%`,
        };
      }

      // Determine sorting options
      let order = [];
      if (sortBy === "alphabet") {
        order = [["nameTm", sortOrder]]; // Sorting alphabetically
      } else if (sortBy === "createdAt") {
        order = [["createdAt", sortOrder]]; // Sorting by creation date
      }

      // Count the total number of products matching the filters
      const countResult = await Product.count({
        where: whereConditions,
        include: {
          model: ProductColorDetails,
          as: "ProductColorDetails",
          attributes: [],
        },
        distinct: true, // Ensure distinct products are counted
      });

      // Query the products with pagination and ordering
      const products = await Product.findAll({
        where: whereConditions,
        include: [
          {
            model: ProductColorDetails,
            as: "ProductColorDetails",
            where: filter,
            // Uncomment to exclude timestamps
            // attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
          {
            model: Category,
            as: "productCategory",
            // where: filter,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        order,
        limit: parseInt(limit),
        offset,
      });

      // Return paginated results
      return res.status(200).json({
        totalItems: countResult,
        totalPages: Math.ceil(countResult / limit),
        currentPage: parseInt(page),
        products: products,
      });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest(e.message));
    }
  }

  static filter = () => {};

  async getOne(req, res, next) {
    try {
      const { id, sortBy = "createdAt" } = req.query;

      if (!id) {
        return next(ApiError.badRequest("Id giriz!"));
      }

      // Validate the existence of the product
      const productExist = await Product.findByPk(id);
      if (!productExist) {
        return next(ApiError.badRequest("Haryt tapylmady!"));
      }

      // Fetch the product with associated color details, sizeTable, and sizes
      const product = await Product.findOne({
        where: { id },
        include: [
          {
            model: ProductColorDetails,
            as: "ProductColorDetails",
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        order: [[sortBy, "ASC"]],
      });

      if (!product) {
        return next(ApiError.badRequest("Product not found"));
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      return next(ApiError.badRequest(error.message));
    }
  }

  async deleteProduct(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.query;

      const product = await Product.findByPk(id);
      if (!product) {
        return next(ApiError.badRequest("Product not found"));
      }

      await ProductColorDetails.destroy({
        where: { productId: id },
        transaction,
      });
      await product.destroy({ transaction });
      await transaction.commit();

      return res
        .status(200)
        .json({ message: "Product and color details deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Error deleting product:", error);
      return next(ApiError.badRequest(error.message));
    }
  }
  async deleteColorDetail(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.query;
      const colorDetail = await ProductColorDetails.findOne({ where: { id } });

      if (!colorDetail) {
        return next(ApiError.badRequest("Color detail not found"));
      }

      await ProductColorDetails.destroy({ where: { id }, transaction });

      await transaction.commit();

      return res
        .status(200)
        .json({ message: "Color detail deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Error deleting color detail:", error);
      return next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new ProductController();
