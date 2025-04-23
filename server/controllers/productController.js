const {
  Product,
  ProductColorDetails,
  Category,
  SizeTable,
  Size,
  SubCategory,
  Segment,
  Status,
  Brand,
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
      console.log(parsedColorDetails);

      // Required fields validation
      const requiredFieldsProduct = [
        "nameTm",
        "nameRu",
        "nameEn",
        "barcode",
        "categoryId",
        "subCategoryId",
        "segmentId",
        "brandId",
      ];
      for (const field of requiredFieldsProduct) {
        if (!parsedProductDetails[field]) {
          return next(ApiError.badRequest(`${field} in product is required`));
        }
      }

      // if (parsedColorDetails.length) {
      const requiredFieldsColor = [
        "productTypeNameTm",
        "productTypeNameRu",
        "productTypeNameEn",
        "sizesWithQuantities",
        "typeStatusId",
        "sizeTableId",
        "sellPrice",
        "incomePrice",
      ];
      for (const field of requiredFieldsColor) {
        for (const color of parsedColorDetails) {
          if (!color[field]) {
            return next(
              ApiError.badRequest(
                `${field} in product color detail is required`
              )
            );
          }
        }
      }

      const checks = [
        {
          model: Category,
          id: parsedProductDetails.categoryId,
          name: "Kategoriýa",
        },
        {
          model: SubCategory,
          id: parsedProductDetails.subCategoryId,
          name: "Subkategoriýa",
        },
        { model: Segment, id: parsedProductDetails.segmentId, name: "Segment" },
        // {
        //   model: Status,
        //   id: parsedColorDetails[0].typeStatusId,
        //   name: "Status",
        // },
        { model: Brand, id: parsedProductDetails.brandId, name: "Brand" },
      ];
      for (const check of checks) {
        const exists = await check.model.findByPk(check.id);
        if (!exists) {
          return next(ApiError.badRequest(`${check.name} tapylmady!`));
        }
      }
      const { imageOne, imageTwo, imageThree, imageFour, imageFive } =
        req.files || {};

      const imagePaths = {
        imageOne: imageOne?.[0]?.filename || null,
        imageTwo: imageTwo?.[0]?.filename || null,
        imageThree: imageThree?.[0]?.filename || null,
        imageFour: imageFour?.[0]?.filename || null,
        imageFive: imageFive?.[0]?.filename || null,
      };
      const hasAtLeastOneImage = Object.values(imagePaths).some(
        (filename) => filename !== null
      );

      if (!hasAtLeastOneImage) {
        return res
          .status(400)
          .json({ message: "At least one image is required." });
      }
      const minImagePath = req.files?.minImage?.[0]?.filename
        ? req.files.minImage[0].filename
        : null;
      const hoverImagePath = req.files?.hoverImage?.[0]?.filename
        ? req.files.hoverImage[0].filename
        : null;

      // Create the product
      const product = await Product.create(
        {
          nameTm: parsedProductDetails.nameTm,
          nameRu: parsedProductDetails.nameRu,
          nameEn: parsedProductDetails.nameEn,
          barcode: parsedProductDetails.barcode,
          categoryId: parsedProductDetails.categoryId,
          subCategoryId: parsedProductDetails.subCategoryId,
          segmentId: parsedProductDetails.segmentId,
          brandId: parsedProductDetails.brandId,
        },
        { transaction }
      );

      // Create product details (colors)
      for (const colorDetail of parsedColorDetails) {
        const productDetail = await ProductColorDetails.create(
          {
            productId: product.id,
            productTypeNameTm: colorDetail.productTypeNameTm,
            productTypeNameRu: colorDetail.productTypeNameRu,
            productTypeNameEn: colorDetail.productTypeNameEn,
            descriptionTm: colorDetail.descriptionTm,
            descriptionRu: colorDetail.descriptionRu,
            descriptionEn: colorDetail.descriptionEn,
            sellPrice: colorDetail.sellPrice,
            incomePrice: colorDetail.incomePrice,
            sizeTableId: colorDetail.sizeTableId,
            typeStatusId: colorDetail.typeStatusId,
            discount_priceTMT: colorDetail.discount_priceTMT,
            discount_pricePercent: colorDetail.discount_pricePercent,
            minImage: minImagePath,
            hoverImage: hoverImagePath,
            ...imagePaths,
          },
          { transaction }
        );

        for (const detail of parsedColorDetails) {
          for (const sizeData of detail.sizesWithQuantities) {
            if (!sizeData.size) {
              throw new Error("Size name cannot be null");
            }

            await Size.create(
              {
                productId: product.id,
                size: sizeData.size,
                quantity: sizeData.quantity || 0,
                sizeTableId: detail.sizeTableId,
                colorDetailId: productDetail.id, // Ensure this is defined
              },
              { transaction }
            );
          }
        }
      }

      await transaction.commit();

      return res.status(201).json({
        product,
        message: "Product, colors, and sizes created successfully",
      });
    } catch (error) {
      await transaction.rollback(); // Rollback transaction on error
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
      const parsedColorDetail = JSON.parse(colorDetail || "[]");
      console.log(colorDetail);

      const requiredFields = [
        "productTypeNameTm",
        "productTypeNameRu",
        "productTypeNameEn",
        "sellPrice",
        "incomePrice",
        "sizesWithQuantities",
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

      const { imageOne, imageTwo, imageThree, imageFour, imageFive } =
        req.files || {};

      const imagePaths = {
        imageOne: imageOne?.[0]?.filename || null,
        imageTwo: imageTwo?.[0]?.filename || null,
        imageThree: imageThree?.[0]?.filename || null,
        imageFour: imageFour?.[0]?.filename || null,
        imageFive: imageFive?.[0]?.filename || null,
      };
      const hasAtLeastOneImage = Object.values(imagePaths).some(
        (filename) => filename !== null
      );

      if (!hasAtLeastOneImage) {
        return res
          .status(400)
          .json({ message: "At least one image is required." });
      }

      const minImagePath = req.files?.minImage?.[0]?.filename
        ? req.files.minImage[0].filename
        : null;

      const hoverImagePath = req.files?.hoverImage?.[0]?.filename
        ? req.files.hoverImage[0].filename
        : null;

      if (!minImagePath || !hoverImagePath) {
        return next(
          ApiError.badRequest("Both minImage and hoverImage are required")
        );
      }

      const newColorDetail = {
        ...parsedColorDetail,
        productId,
        descriptionTm: parsedColorDetail.descriptionTm,
        descriptionRu: parsedColorDetail.descriptionRu,
        descriptionEn: parsedColorDetail.descriptionEn,
        discount_priceTMT: parsedColorDetail.discount_priceTMT,
        discount_pricePercent: parsedColorDetail.discount_pricePercent,
        sellPrice: parsedColorDetail.sellPrice,
        incomePrice: parsedColorDetail.incomePrice,
        minImage: minImagePath,
        sizeTableId: parsedColorDetail.sizeTableId,
        typeStatusId: parsedColorDetail.typeStatusId,
        hoverImage: hoverImagePath,
        ...imagePaths,
      };

      const createdColorDetail = await ProductColorDetails.create(
        newColorDetail,
        { transaction }
      );

      // for (const detail of parsedColorDetail) {
      for (const sizeData of parsedColorDetail.sizesWithQuantities) {
        console.log(sizeData.size);

        if (!sizeData.size) {
          return next(ApiError.badRequest("Size name can't be null"));
        }

        await Size.create(
          {
            productId: product.id,

            size: sizeData.size,
            quantity: sizeData.quantity || 0,
            sizeTableId: parsedColorDetail.sizeTableId,
            colorDetailId: createdColorDetail.id, // Ensure this is defined
          },
          { transaction }
        );
      }
      // }
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
  async updateProduct(req, res, next) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      const {
        nameTm,
        nameEn,
        nameRu,
        barcode,
        categoryId,
        subCategoryId,
        segmentId,
        brandId,
        isActive,
        id,
      } = req.body;

      // Validate required fields
      const requiredFields = [
        "nameTm",
        "nameRu",
        "nameEn",
        "barcode",
        "categoryId",
        "subCategoryId",
        "segmentId",
        "brandId",
        "id", // Product ID must be included
      ];

      for (const field of requiredFields) {
        if (!req.body[field]) {
          return next(ApiError.badRequest(`${field} is required`));
        }
      }
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ message: "Category not found." });
      }
      const subcategory = await SubCategory.findByPk(subCategoryId);
      if (!subcategory) {
        return res.status(400).json({ message: "subCategory not found." });
      }
      const segment = await Segment.findByPk(segmentId);
      if (!segment) {
        return res.status(400).json({ message: "segment not found." });
      }
      const brand = await Brand.findByPk(brandId);
      if (!brand) {
        return res.status(400).json({ message: "segment not found." });
      }

      // Check if the product exists
      const product = await Product.findByPk(id);
      if (!product) {
        return next(ApiError.badRequest("Product not found"));
      }

      // Update the product details
      await product.update(
        {
          nameTm,
          nameRu,
          nameEn,
          barcode,
          categoryId,
          subCategoryId,
          isActive: isActive ?? product.isActive, // Update isActive only if provided
          segmentId,
          brandId,
        },
        { where: { id }, transaction }
      );

      // Commit the transaction
      await transaction.commit();

      return res.status(200).json({
        message: "Product updated successfully",
        product, // Return updated product
      });
    } catch (error) {
      await transaction.rollback(); // Rollback on error
      console.error("Error updating product:", error);
      return next(ApiError.badRequest(` ${error.message}`));
    }
  }

  async updateProductDetails(req, res, next) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      const { productId, colorDetailId, colorDetail } = req.body; // Take productId, colorDetailId, and colorDetail from request body
      const parsedColorDetail = JSON.parse(colorDetail || "{}");

      // Required fields for product details
      const requiredFields = [
        "productTypeNameTm",
        "productTypeNameRu",
        "productTypeNameEn",
        "sellPrice",
        "incomePrice",
        "sizesWithQuantities",
      ];

      console.log(parsedColorDetail);
      for (const color of parsedColorDetail) {
        for (const field of requiredFields) {
          if (!color[field]) {
            return next(
              ApiError.badRequest(
                `${field} is required in product color detail`
              )
            );
          }
        }
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        return next(ApiError.badRequest("Product not found"));
      }

      const minImagePath = req.files?.minImage?.[0]?.filename
        ? req.files.minImage[0].filename
        : null;
      const hoverImagePath = req.files?.hoverImage?.[0]?.filename
        ? req.files.hoverImage[0].filename
        : null;
      const imageUpdates = {
        imageOne:
          req.files?.imageOne?.[0]?.filename ??
          (product.imageOne !== null ? product.imageOne : null),

        imageTwo:
          req.body.imageTwo === "null"
            ? null
            : req.files?.imageTwo?.[0]?.filename ?? product.imageTwo,

        imageThree:
          req.body.imageThree === "null"
            ? null
            : req.files?.imageThree?.[0]?.filename ?? product.imageThree,

        imageFour:
          req.body.imageFour === "null"
            ? null
            : req.files?.imageFour?.[0]?.filename ?? product.imageFour,

        imageFive:
          req.body.imageFive === "null"
            ? null
            : req.files?.imageFive?.[0]?.filename ?? product.imageFive,
      };

      if (colorDetailId) {
        const existingColorDetail = await ProductColorDetails.findOne({
          where: {
            id: colorDetailId,
            productId: product.id,
          },
          transaction,
        });

        if (existingColorDetail) {
          for (const detail of parsedColorDetail) {
            await ProductColorDetails.update(
              {
                productTypeNameTm:
                  detail.productTypeNameTm ||
                  existingColorDetail.productTypeNameTm,
                productTypeNameRu:
                  detail.productTypeNameRu ||
                  existingColorDetail.productTypeNameRu,
                productTypeNameEn:
                  detail.productTypeNameEn ||
                  existingColorDetail.productTypeNameEn,
                descriptionTm:
                  detail.descriptionTm || existingColorDetail.descriptionTm,
                descriptionRu:
                  detail.descriptionRu || existingColorDetail.descriptionRu,
                descriptionEn:
                  detail.descriptionEn || existingColorDetail.descriptionEn,
                sellPrice: detail.sellPrice || existingColorDetail.sellPrice,
                sizeTableId:
                  detail.sizeTableId || existingColorDetail.sizeTableId,
                typeStatusId:
                  detail.typeStatusId || existingColorDetail.typeStatusId,

                incomePrice:
                  detail.incomePrice || existingColorDetail.incomePrice,
                minImage: minImagePath || existingColorDetail.minImage,
                hoverImage: hoverImagePath || existingColorDetail.hoverImage,
                ...imageUpdates,
                sizesWithQuantities:
                  detail.sizesWithQuantities ||
                  existingColorDetail.sizesWithQuantities,
              },
              { where: { id: colorDetailId }, transaction }
            );
          }
          for (const detail of parsedColorDetail) {
            for (const sizeData of detail.sizesWithQuantities) {
              const { id, quantity } = sizeData;
              console.log(sizeData);

              if (id) {
                const existingSize = await Size.findByPk(id);
                console.log(existingSize);

                if (existingSize) {
                  await Size.update(
                    {
                      quantity,
                    },
                    {
                      where: { id: id },
                      transaction,
                    }
                  );
                } else {
                  await transaction.rollback();
                  return next(ApiError.badRequest("Size not found"));
                }
              } else {
                return next(ApiError.badRequest("Size ID is required"));
              }
            }
          }
        } else {
          return next(
            ApiError.badRequest(
              `Color detail with ID ${colorDetailId} not found`
            )
          );
        }
      } else {
        return next(ApiError.badRequest("colorDetailId is required"));
      }

      // Commit the transaction
      await transaction.commit();

      return res.status(200).json({
        message: "Product color detail and sizes updated successfully",
      });
    } catch (error) {
      await transaction.rollback(); // Rollback on error
      console.error("Error updating product details:", error);
      return next(
        ApiError.badRequest(
          `Failed to update product details: ${error.message}`
        )
      );
    }
  }

  async getAll(req, res, next) {
    try {
      const filter = {};
      const {
        categoryId,
        subCategoryId,
        segmentId,
        brandId,
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
      if (segmentId) {
        whereConditions.segmentId = segmentId;
      }
      if (brandId) {
        whereConditions.brandId = brandId;
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

  async getOne(req, res, next) {
    try {
      const { id, sortBy = "createdAt" } = req.query;

      if (!id) {
        return next(ApiError.badRequest("Id giriz!")); // "Enter ID!"
      }

      // Validate the product exists
      const productExist = await Product.findByPk(id);
      if (!productExist) {
        return next(ApiError.badRequest("Haryt tapylmady!")); // "Product not found!"
      }

      // Fetch product along with sizes
      const product = await Product.findOne({
        where: { id },
        include: [
          {
            model: ProductColorDetails,
            as: "ProductColorDetails",
            include: [
              {
                model: Size,
                as: "sizes",
                // attributes: { exclude: ["createdAt", "updatedAt"] },
                attributes: ["id", "size", "quantity", "sizeTableId"],
                // where: id ? { productId: id } : {},
              },
            ],
            // include: [
            //   {
            //     model: SizeTable,
            //     as: "sizeTable",
            //     // where: filter,
            //     attributes: { exclude: ["createdAt", "updatedAt"] },

            //   },
            // ],
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] }, // Exclude timestamps
        order: [[sortBy, "ASC"]],
      });

      if (!product) {
        return next(ApiError.badRequest("Haryt tapylmady!")); // "Product not found!"
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      return next(ApiError.badRequest(error.message));
    }
  }
  async getOneProductColor(req, res, next) {
    try {
      const { id, sortBy = "createdAt" } = req.query;

      if (!id) {
        return next(ApiError.badRequest("Id giriz!"));
      }

      // Validate the product exists
      const productColorExist = await ProductColorDetails.findByPk(id);
      if (!productColorExist) {
        return next(ApiError.badRequest("Haryt görnüşi tapylmady!"));
      }

      // Fetch product along with sizes
      const product = await ProductColorDetails.findOne({
        where: { id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        order: [[sortBy, "ASC"]],
      });
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
