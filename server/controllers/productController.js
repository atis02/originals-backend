const { Product, ProductColorDetails } = require('../models/model');
const ApiError = require('../error/apiError');
const  sequelize  = require('../database');

class ProductController {
//   async create(req, res, next) {
//     const transaction = await sequelize.transaction(); // Start a transaction
//     try {
//       // Extract product data from the request body
//       const {
//         nameTm,
//         nameRu,
//         nameEn,
//         barcode,
//         categoryId,
//         subCategoryId,
//         isActive,
//         colorDetails, // Array of ProductColorDetails
//       } = req.body;

//       // Validate required fields
//       if (!nameTm || !nameRu || !nameEn || !barcode || !categoryId || !subCategoryId) {
//         return next(ApiError.badRequest('Missing required fields for product'));
//       }

//       // Process file uploads
//       const minImagePath = req.files?.minImage ? `/static/${req.files.minImage[0].filename}` : null;
//       const hoverImagePath = req.files?.hoverImage ? `/static/${req.files.hoverImage[0].filename}` : null;
//       const fullImagePaths = req.files?.fullImages
//         ? req.files.fullImages.map(file => `/static/${file.filename}`)
//         : [];

//       // Create the Product
//       const product = await Product.create(
//         {
//           nameTm,
//           nameRu,
//           nameEn,
//           barcode,
//           categoryId,
//           subCategoryId,
//           isActive: isActive || true,
//           minImage: minImagePath,
//           hoverImage: hoverImagePath,
//           fullImages: fullImagePaths,
//         },
//         { transaction }
//       );

//       // Validate and create ProductColorDetails
//       if (colorDetails && Array.isArray(colorDetails)) {
//         const colorDetailsData = colorDetails.map(detail => ({
//           ...detail,
//           productId: product.id, // Associate with the created Product
//         }));

//         await ProductColorDetails.bulkCreate(colorDetailsData, { transaction });
//       }

//       // Commit transaction
//       await transaction.commit();

//       return res.status(201).json({ product, message: 'Product and color details created successfully' });
//     } catch (error) {
//       await transaction.rollback(); // Rollback transaction on error
//       console.error(error);
//       return next(ApiError.internal('Failed to create product and color details'));
//     }
//   }
async create(req, res, next) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
        // console.log('Request Body:', req.body);
const {productDetail,colorDetail} = req.body; 
const parsedProductDetails = JSON.parse(productDetail );
const parsedColorDetails = JSON.parse(colorDetail || '[]');

console.log(parsedColorDetails);
console.log(parsedProductDetails);

        // const {
        //     nameTm:productDetail.nameTm,
        //     nameRu,
        //     nameEn,
        //     barcode,
        //     categoryId,
        //     subCategoryId,
        //     isActive,
        //     colorDetails, // JSON string
        // } = req.body;
 
        if (!parsedProductDetails.nameTm ||
             !parsedProductDetails.nameRu ||
              !parsedProductDetails.nameEn ||
               !parsedProductDetails.barcode ||
                !parsedProductDetails.categoryId ||
                 !parsedProductDetails.subCategoryId||
                // !parsedColorDetails
                !parsedColorDetails[0].nameTm ||
             !parsedColorDetails[0].nameRu ||
              !parsedColorDetails[0].nameEn ||
              !parsedColorDetails[0].descriptionTm ||
              !parsedColorDetails[0].descriptionEn ||
              !parsedColorDetails[0].descriptionRu ||
              !parsedColorDetails[0].sellPrice ||
              !parsedColorDetails[0].incomePrice ||
              !parsedColorDetails[0].productColorId ||
              !parsedColorDetails[0].productQuantity 
                ) {
            return next(ApiError.badRequest('Missing required fields for product'));
        }

        // Parse colorDetails JSON string

        const minImagePath = req.files?.minImage?.[0]?.filename ? `/static/${req.files.minImage[0].filename}` : null;
        const hoverImagePath = req.files?.hoverImage?.[0]?.filename ? `/static/${req.files.hoverImage[0].filename}` : null;
        const fullImagePaths = req.files?.fullImages?.map(file => `/static/${file.filename}`) || [];

        const product = await Product.create(
            {
                nameTm:parsedProductDetails.nameTm,
                nameRu:parsedProductDetails.nameRu,
                nameEn:parsedProductDetails.nameEn,
                barcode:parsedProductDetails.barcode,
                categoryId:parsedProductDetails.categoryId,
                subCategoryId:parsedProductDetails.subCategoryId,
                // isActive: isActive || true,
          
            },
            { transaction }
        );
        
        if (parsedColorDetails.length) {
            const colorDetailsData = parsedColorDetails.map(detail => ({
                ...detail,
                productId: product.id,
                minImage: minImagePath,
                hoverImage: hoverImagePath,
                fullImages: fullImagePaths,
            }));

            await ProductColorDetails.bulkCreate(colorDetailsData, { transaction });
        }

        await transaction.commit();

        return res.status(201).json({ product, message: 'Product and color details created successfully' });
    } catch (error) {
        await transaction.rollback(); // Rollback on error
        console.error('Error creating product:', error);
        return next(ApiError.internal(`Failed to create product: ${error.message}`));
    }
}
async getAll(req,res,next){
    try {
        const products=  await  Product.findAll({
            include: { model: ProductColorDetails, as: 'ProductColorDetails',
                attributes: { exclude: ['createdAt', 'updatedAt'] },

             },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            order: [['nameTm', 'ASC']] 
        })
        return res.status(200).json(products);
    } catch (e) {
        // return res.status(500).json("Not found users");
        console.log(e);
        
        return next(ApiError.badRequest('Kategoriýa tapylmady'))
    }

}
}

module.exports = new ProductController();
