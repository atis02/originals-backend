const sequelize = require("../database");
const { Sequelize, DataTypes } = require("sequelize");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем функцию для генерации UUID
    },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "user" },
  },
  {
    timestamps: true, // автоматически добавит createdAt и updatedAt
  }
);

const Basket = sequelize.define("basket", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
});

const BasketProduct = sequelize.define("basketProduct", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
});

const Product = sequelize.define("product", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Auto-generate UUID
  },
  nameTm: { type: DataTypes.STRING, allowNull: false },
  nameRu: { type: DataTypes.STRING, allowNull: false },
  nameEn: { type: DataTypes.STRING, allowNull: false },
  barcode: { type: DataTypes.STRING, allowNull: false },
  categoryId: { type: DataTypes.STRING, allowNull: false },
  subCategoryId: { type: DataTypes.STRING, allowNull: false },
  segmentId: { type: DataTypes.STRING, allowNull: false },
  statusId: {type: DataTypes.STRING,  allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },

});

const ProductColorDetails = sequelize.define("ProductColorDetails", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Auto-generate UUID
  },
  nameTm: { type: DataTypes.STRING, allowNull: false },
  nameRu: { type: DataTypes.STRING, allowNull: false },
  nameEn: { type: DataTypes.STRING, allowNull: false },
  descriptionTm: { type: DataTypes.STRING, allowNull: false },
  descriptionRu: { type: DataTypes.STRING, allowNull: false },
  descriptionEn: { type: DataTypes.STRING, allowNull: false },
  sellPrice: { type: DataTypes.INTEGER, allowNull: false },
  incomePrice: { type: DataTypes.INTEGER, allowNull: false },
  discount_priceTMT: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  discount_pricePercent: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  // sizeTableId: { type: DataTypes.UUID, allowNull: false },

  // Store sizes with quantities as an array of objects
  sizesWithQuantities: {
    type: DataTypes.JSONB, // You can use JSONB for better flexibility
    allowNull: false,
    defaultValue: [],
  },

  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  minImage: { type: DataTypes.STRING, allowNull: true },
  hoverImage: { type: DataTypes.STRING, allowNull: true },
  fullImages: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Array of image paths
    allowNull: true,
    defaultValue: [],
  },
  // productQuantity: { type: DataTypes.INTEGER, allowNull: false },
});
const Status = sequelize.define("status", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, allowNull: false },
  nameRu: { type: DataTypes.STRING, allowNull: false },
  nameEn: { type: DataTypes.STRING, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

});
// const ProductColorDetails = sequelize.define("ProductColorDetails", {
//   id: {
//     type: DataTypes.UUID,
//     primaryKey: true,
//     defaultValue: Sequelize.literal("gen_random_uuid()"), // Automatically generate UUID
//   },
//   nameTm: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   nameRu: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   nameEn: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   descriptionTm: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   }, // Use TEXT for longer descriptions
//   descriptionRu: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },
//   descriptionEn: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },
//   sellPrice: {
//     type: DataTypes.FLOAT, // FLOAT allows for fractional prices if needed
//     allowNull: false
//   },
//   incomePrice: {
//     type: DataTypes.FLOAT,
//     allowNull: false
//   },
//   discountPriceTMT: {
//     type: DataTypes.FLOAT,
//     allowNull: true,
//     defaultValue: 0
//   },
//   discountPricePercent: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: 0
//   },
//   sizesWithQuantities: {
//     type: DataTypes.JSONB, // JSONB is better for handling structured data like sizes and quantities
//     allowNull: false,
//     defaultValue: [], // Default to an empty array
//   },
//   isActive: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true
//   },
//   minImage: {
//     type: DataTypes.STRING,
//     allowNull: true
//   }, // Path to the minimum image
//   hoverImage: {
//     type: DataTypes.STRING,
//     allowNull: true
//   }, // Path to the hover image
//   fullImages: {
//     type: DataTypes.ARRAY(DataTypes.STRING), // Array of image paths
//     allowNull: true,
//     defaultValue: [],
//   },
//   productId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     references: {
//       model: "Products", // Name of the referenced table
//       key: "id",         // Primary key in the referenced table
//     },
//     onUpdate: "CASCADE",
//     onDelete: "CASCADE",
//   },
// }, {
//   tableName: "ProductColorDetails", // Explicitly define table name if needed
//   timestamps: true, // Automatically adds createdAt and updatedAt fields
//   underscored: true, // Converts camelCase fields to snake_case in the database
// });
const SizeTable = sequelize.define("sizeTable", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  name: { type: DataTypes.STRING, allowNull: false },
});
const Size = sequelize.define("size", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"),
  },
  order: { type: DataTypes.INTEGER, allowNull: false },
  sizeTableId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
});

const Category = sequelize.define("category", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameRu: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameEn: { type: DataTypes.STRING, unique: true, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  image: { type: DataTypes.STRING, allowNull: true },
});
const SubCategory = sequelize.define("subCategory", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameRu: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameEn: { type: DataTypes.STRING, unique: true, allowNull: false },
  categoryId: { type: DataTypes.UUID, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});
const Segment = sequelize.define("segment", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameRu: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameEn: { type: DataTypes.STRING, unique: true, allowNull: false },
  subCategoryId: { type: DataTypes.UUID, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});

const ProductInfo = sequelize.define("productInfo", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  title: { type: DataTypes.STRING, allowNull: false },
  categoryId: { type: DataTypes.UUID, allowNull: false },
  subCategoryId: { type: DataTypes.UUID, allowNull: false },
  description: { type: DataTypes.TEXT },
});

// Устанавливаем связи между моделями
User.hasOne(Basket);
Basket.belongsTo(User);

Basket.hasMany(BasketProduct);
BasketProduct.belongsTo(Basket);

Product.hasMany(BasketProduct);
BasketProduct.belongsTo(Product);

Product.hasMany(ProductInfo);
ProductInfo.belongsTo(Product);

// Product.hasMany(ProductColorDetails);
// ProductColorDetails.belongsTo(Product);

ProductColorDetails.belongsTo(SizeTable, {
  foreignKey: "sizeTableId",
  as: "sizeTable",
});
SizeTable.hasMany(ProductColorDetails, {
  foreignKey: "sizeTableId",
  as: "productColorDetails",
});

// SizeTable ↔ Size
SizeTable.hasMany(Size, {
  foreignKey: "sizeTableId", // Ensure this matches the column in the Size model
  as: "sizes",
});
Size.belongsTo(SizeTable, {
  foreignKey: "sizeTableId", // Ensure this matches the column in the Size model
  as: "sizeTable",
});

Product.hasMany(ProductColorDetails, {
  foreignKey: "productId",
  as: "ProductColorDetails",
  onDelete: "CASCADE",
});

ProductColorDetails.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

Product.belongsTo(Category, {
  as: "productCategory",
  foreignKey: "categoryId",
});
Category.hasMany(Product, {
  as: "products",
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});

Product.belongsTo(Segment, {
  as: "segment",
  foreignKey: "segmentId",
});
Segment.hasMany(Product, {
  as: "products",
  foreignKey: "segmentId",
  onDelete: "CASCADE",
});

// Define the relationship
Product.belongsTo(Status, {
  foreignKey: "statusId",
  as: "status",
});
Status.hasMany(Product, {
  foreignKey: "statusId",
  as: "products",
});


Product.belongsTo(SubCategory, {
  as: "subCategory",
  foreignKey: "subCategoryId",
});
SubCategory.hasMany(Product, {
  as: "products",
  foreignKey: "subCategoryId",
  onDelete: "CASCADE",
});

Category.hasMany(SubCategory, {
  as: "subCategories",
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});
SubCategory.belongsTo(Category, {
  as: "parentCategory",
  foreignKey: "categoryId",
});

// SizeTable.hasMany(Size, { as: 'sizes', foreignKey: 'categoryId' });
// SubCategory.belongsTo(Category, { as: 'parentCategory', foreignKey: 'categoryId' });
SubCategory.hasMany(Segment, {
  as: "segments",
  foreignKey: "subCategoryId",
  onDelete: "CASCADE",
});
Segment.belongsTo(SubCategory, {
  as: "parentSubCategory",
  foreignKey: "subCategoryId",
});

module.exports = {
  User,
  Basket,
  BasketProduct,
  Product,
  SizeTable,
  Size,
  ProductColorDetails,
  Category,
  SubCategory,
  ProductInfo,
  Segment,
  Status
};
