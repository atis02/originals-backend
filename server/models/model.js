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
  categoryId: { type: DataTypes.UUID, allowNull: false },
  subCategoryId: { type: DataTypes.UUID, allowNull: false },
  segmentId: { type: DataTypes.UUID, allowNull: false },
  brandId: { type: DataTypes.UUID, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

const ProductColorDetails = sequelize.define("ProductColorDetails", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Auto-generate UUID
  },
  productTypeNameTm: { type: DataTypes.STRING, allowNull: false },
  productTypeNameRu: { type: DataTypes.STRING, allowNull: false },
  productTypeNameEn: { type: DataTypes.STRING, allowNull: false },
  descriptionTm: { type: DataTypes.TEXT, allowNull: true },
  descriptionRu: { type: DataTypes.TEXT, allowNull: true },
  descriptionEn: { type: DataTypes.TEXT, allowNull: true },
  sellPrice: { type: DataTypes.INTEGER, allowNull: false },
  incomePrice: { type: DataTypes.INTEGER, allowNull: false },
  totalSelling: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  discount_priceTMT: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  discount_pricePercent: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  sizeTableId: { type: DataTypes.UUID, allowNull: false },
  typeStatusId: { type: DataTypes.UUID, allowNull: false },
  // sizeId: { type: DataTypes.UUID, allowNull: false },

  // Store sizes with quantities as an array of objects
  // sizesWithQuantities: {
  //   type: DataTypes.JSONB, // You can use JSONB for better flexibility
  //   allowNull: false,
  //   defaultValue: [],
  // },

  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  minImage: { type: DataTypes.STRING, allowNull: true },
  hoverImage: { type: DataTypes.STRING, allowNull: true },
  imageOne: { type: DataTypes.STRING, allowNull: true },
  imageTwo: { type: DataTypes.STRING, allowNull: true },
  imageThree: { type: DataTypes.STRING, allowNull: true },
  imageFour: { type: DataTypes.STRING, allowNull: true },
  imageFive: { type: DataTypes.STRING, allowNull: true },
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
const Basket = sequelize.define(
  "baskets",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.literal("gen_random_uuid()"), // UUID for unique basket ID
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users", // Assuming you have a `users` model
        key: "id",
      },
    },
    productColorDetailId: { type: DataTypes.UUID, allowNull: false },
  },
  {
    timestamps: true,
  }
);

const BasketProduct = sequelize.define(
  "basketProducts",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.literal("gen_random_uuid()"), // UUID for unique basketProduct ID
    },
    basketId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "baskets", // Reference to Basket model
        key: "id",
      },
    },

    productColorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "ProductColorDetails", // Reference to Product model
        key: "id",
      },
    },
    productQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    // sizeTableId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   references: {
    //     model: "SizeTable", // Reference to sizeTable model
    //     key: "id",
    //   },
    // },
    sizeId: {
      type: DataTypes.UUID,
      allowNull: false,
      // references: {
      //   model: "Size",
      //   key: "id",
      // },
    },
  },
  {
    timestamps: true,
  }
);
// orders
const Order = sequelize.define("order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderNumber: { type: DataTypes.INTEGER, unique: true, allowNull: false },
  deliveryDate: { type: DataTypes.STRING, allowNull: true },
  deliveryType: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  orderStatusId: { type: DataTypes.UUID, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  notes: { type: DataTypes.STRING, allowNull: true },
  customerName: { type: DataTypes.STRING, allowNull: false },
  customerSurname: { type: DataTypes.STRING, allowNull: false },
  customerPhoneNumber: { type: DataTypes.STRING, allowNull: false },
  orderRegion: { type: DataTypes.STRING, allowNull: false },
  orderDeliveryCityPaymentId: { type: DataTypes.UUID, allowNull: true },
  shippingAddress: { type: DataTypes.STRING, allowNull: false },
});
const OrderDeliveryCityPayment = sequelize.define(
  "orderDeliveryCityPayment",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
    },
    nameTm: { type: DataTypes.STRING, allowNull: false },
    nameRu: { type: DataTypes.STRING, allowNull: false },
    nameEn: { type: DataTypes.STRING, allowNull: false },
    deliveryPrice: { type: DataTypes.INTEGER, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { tableName: "orderDeliveryCityPayment" }
);
const OrderItem = sequelize.define("orderItem", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"),
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

const OrderStatus = sequelize.define("orderStatus", {
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

const SizeTable = sequelize.define("sizeTable", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  name: { type: DataTypes.STRING, allowNull: false },
});

const SizeTableType = sequelize.define("sizeTableType", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"),
  },
  sizeTableId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "sizeTables", // Assuming your SizeTable model uses this table name
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define relationships

const Size = sequelize.define("size", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"),
  },
  // order: { type: DataTypes.INTEGER, allowNull: false },
  sizeTableId: { type: DataTypes.UUID, allowNull: false },
  size: { type: DataTypes.STRING, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
  colorDetailId: { type: DataTypes.UUID, allowNull: false },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
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
  nameTm: { type: DataTypes.STRING, allowNull: false },
  nameRu: { type: DataTypes.STRING, allowNull: false },
  nameEn: { type: DataTypes.STRING, allowNull: false },
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
  nameTm: { type: DataTypes.STRING, allowNull: false },
  nameRu: { type: DataTypes.STRING, allowNull: false },
  nameEn: { type: DataTypes.STRING, allowNull: false },
  subCategoryId: { type: DataTypes.UUID, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});
const Brand = sequelize.define("brand", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameRu: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameEn: { type: DataTypes.STRING, unique: true, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});
const Banner = sequelize.define("banner", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, allowNull: false },
  nameRu: { type: DataTypes.STRING, allowNull: false },
  nameEn: { type: DataTypes.STRING, allowNull: false },
  // categoryId: { type: DataTypes.UUID, allowNull: false },
  mobileImage: { type: DataTypes.STRING, allowNull: true },
  desktopImage: { type: DataTypes.STRING, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  descriptionNameTm: { type: DataTypes.STRING, allowNull: true },
  descriptionNameRu: { type: DataTypes.STRING, allowNull: true },
  descriptionNameEn: { type: DataTypes.STRING, allowNull: true },
});

BasketProduct.belongsTo(Basket, { foreignKey: "basketId" });
Basket.hasMany(BasketProduct, { foreignKey: "basketId" });

BasketProduct.hasMany(SizeTable);

ProductColorDetails.belongsTo(SizeTable, {
  foreignKey: "sizeTableId",
  as: "sizeTable",
});
SizeTable.hasMany(ProductColorDetails, {
  foreignKey: "sizeTableId",
  as: "productColorDetails",
});

ProductColorDetails.hasMany(Size, { as: "sizes", foreignKey: "colorDetailId" });
Size.belongsTo(ProductColorDetails, { foreignKey: "colorDetailId" });

Brand.hasMany(Product, {
  foreignKey: "brandId",
  as: "products",
  onDelete: "CASCADE",
});

// A Product belongs to a single Brand
Product.belongsTo(Brand, {
  foreignKey: "brandId",
  as: "brand",
});

// SizeTable ↔ Size
SizeTable.hasMany(Size, {
  foreignKey: "sizeTableId",
  as: "sizes",
});
Size.belongsTo(SizeTable, {
  foreignKey: "sizeTableId",
  as: "sizeTable",
});

SizeTable.hasMany(SizeTableType, {
  foreignKey: "sizeTableId",
  as: "types",
});

SizeTableType.belongsTo(SizeTable, {
  foreignKey: "sizeTableId",
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
ProductColorDetails.belongsTo(Status, {
  foreignKey: "statusId",
  as: "status",
});

Status.hasMany(ProductColorDetails, {
  foreignKey: "statusId",
  as: "productColorDetails",
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

SubCategory.hasMany(Segment, {
  as: "segments",
  foreignKey: "subCategoryId",
  onDelete: "CASCADE",
});
Segment.belongsTo(SubCategory, {
  as: "parentSubCategory",
  foreignKey: "subCategoryId",
});

// Basket
Basket.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Basket, {
  foreignKey: "userId",
  as: "baskets",
});
// Basket.belongsToMany(Product, {
//   // through: "basketProducts",
//   foreignKey: "basketId",
//   as: "products",
// });

// Product.belongsToMany(Basket, {
//   through: "basketProducts",
//   foreignKey: "productId",
//   as: "baskets",
// });
Basket.belongsTo(ProductColorDetails, {
  foreignKey: "productColorDetailId",
  as: "productColorDetail",
});

ProductColorDetails.hasMany(Basket, {
  foreignKey: "productColorDetailId",
  as: "baskets",
});
BasketProduct.hasOne(Size, {
  foreignKey: "sizeId",
  as: "size",
});

Size.belongsTo(Basket, {
  foreignKey: "sizeId",
  as: "baskets",
});

// Basket

Order.hasMany(OrderItem, { as: "orderItems", foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.belongsTo(OrderStatus, {
  foreignKey: "order_statusId",
  as: "order_status",
});

OrderStatus.hasMany(Product, {
  foreignKey: "order_statusId",
  as: "products",
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
  Segment,
  Status,
  Brand,
  OrderStatus,
  Order,
  OrderItem,
  SizeTableType,
  Banner,
  OrderDeliveryCityPayment,
};
