// const sequelize = require('../database')
// const {Sequelize,DataTypes} = require('sequelize')

// const User = sequelize.define('user',{
//     id:{type:DataTypes.UUID,primaryKey:true,autoIncrement:true, defaultValue:  Sequelize.literal('gen_random_uuid()'),  },
//     email:{type:DataTypes.STRING,unique:true},
//     password:{type:DataTypes.STRING},
//     role:{type:DataTypes.STRING,defaultValue:'user'},
// }
// , {
//     timestamps: true, // автоматически добавит createdAt и updatedAt
//   })

// const Basket = sequelize.define('basket',{
//     id:{type:DataTypes.UUID,defaultValue: DataTypes.UUIDV4,primaryKey:true,autoIncrement:true},
// })
// const BasketProduct = sequelize.define('basketProduct',{
//     id:{type:DataTypes.UUID,defaultValue: DataTypes.UUIDV4,primaryKey:true,autoIncrement:true},
// })
// const Product = sequelize.define('product', {
//     id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
//     name: { type: DataTypes.STRING, unique: true, allowNull: false },
//     price: { type: DataTypes.INTEGER, allowNull: false },
//     category: { type: DataTypes.STRING }, // Keep this as an attribute
//     image: { type: DataTypes.STRING, allowNull: false },
//   });
  

// const Category = sequelize.define('category',{
//     id:{type:DataTypes.UUID,defaultValue: DataTypes.UUIDV4,primaryKey:true,autoIncrement:true},
//     name:{type:DataTypes.STRING,unique:true,allowNull:false},
// })

// const SubCategory = sequelize.define('subCategory',{
//     id:{type:DataTypes.UUID,defaultValue: DataTypes.UUIDV4,primaryKey:true,autoIncrement:true},
//     name:{type:DataTypes.STRING,unique:true,allowNull:false},
// })
// const ProductInfo = sequelize.define('productInfo',{
//     id:{type:DataTypes.UUID,defaultValue: DataTypes.UUIDV4,primaryKey:true,autoIncrement:true},
//     title:{type:DataTypes.STRING,allowNull:false},
//     categoryId:{type:DataTypes.UUID, allowNull: false},
//     subCategoryId:{type:DataTypes.UUID, allowNull: false},
//     description:{type:DataTypes.TEXT},
// })

// // User.hasOne(Basket)
// // Basket.belongsTo(User)

// // Basket.hasMany(BasketProduct)
// // BasketProduct.belongsTo(Basket)

// // Product.hasMany(BasketProduct)
// // BasketProduct.belongsTo(Product)

// // Product.hasMany(ProductInfo)
// // ProductInfo.belongsTo(Product)

// // Category.hasMany(Product)
// // Product.belongsTo(Category)

// // Product.belongsTo(Category, { as: 'productCategory', foreignKey: 'categoryId' });
// // Category.hasMany(Product, { as: 'products', foreignKey: 'categoryId' });


// // SubCategory.hasMany(Product)
// // Product.belongsTo(SubCategory)

// // Category.hasMany(SubCategory)
// // SubCategory.belongsTo(Category)
// User.hasOne(Basket);
// Basket.belongsTo(User);

// Basket.hasMany(BasketProduct);
// BasketProduct.belongsTo(Basket);

// Product.hasMany(BasketProduct);
// BasketProduct.belongsTo(Product);

// Product.hasMany(ProductInfo);
// ProductInfo.belongsTo(Product);

// Product.belongsTo(Category, { as: 'productCategory', foreignKey: 'categoryId' });
// Category.hasMany(Product, { as: 'products', foreignKey: 'categoryId' });

// Product.belongsTo(SubCategory, { as: 'subCategory', foreignKey: 'subCategoryId' });
// SubCategory.hasMany(Product, { as: 'products', foreignKey: 'subCategoryId' });

// Category.hasMany(SubCategory, { as: 'subCategories', foreignKey: 'categoryId' });
// SubCategory.belongsTo(Category, { as: 'parentCategory', foreignKey: 'categoryId' });


// module.exports = {User, Basket, BasketProduct, Product, Category, SubCategory, ProductInfo}

const sequelize = require('../database');
const { Sequelize, DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal('gen_random_uuid()'), // Используем функцию для генерации UUID
  },
  email: { type: DataTypes.STRING, unique: true,allowNull:false },
  password: { type: DataTypes.STRING,allowNull:false },
  role: { type: DataTypes.STRING, defaultValue: 'user' },
}, {
  timestamps: true, // автоматически добавит createdAt и updatedAt
});

const Basket = sequelize.define('basket', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal('gen_random_uuid()'), // Используем UUID
  },
});

const BasketProduct = sequelize.define('basketProduct', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal('gen_random_uuid()'), // Используем UUID
  },
});

const Product = sequelize.define('product', {
  id: { 
    type: DataTypes.UUID, 
    primaryKey: true, 
    defaultValue: Sequelize.literal('gen_random_uuid()'), // Используем UUID
  },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  category: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING, allowNull: false },
});

const Category = sequelize.define('category', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal('gen_random_uuid()'), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameRu: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameEn: { type: DataTypes.STRING, unique: true, allowNull: false },
  isActive:{type: DataTypes.BOOLEAN, allowNull: false,defaultValue:true},
  image: { type: DataTypes.STRING, allowNull: true },
  
});

const SubCategory = sequelize.define('subCategory', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal('gen_random_uuid()'), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameRu: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameEn: { type: DataTypes.STRING, unique: true, allowNull: false },
  categoryId:{type: DataTypes.UUID, allowNull: false},
  image: { type: DataTypes.STRING, allowNull: true },
  isActive:{type: DataTypes.BOOLEAN, allowNull: false,defaultValue:true},

});

const ProductInfo = sequelize.define('productInfo', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal('gen_random_uuid()'), // Используем UUID
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

Product.belongsTo(Category, { as: 'productCategory', foreignKey: 'categoryId' });
Category.hasMany(Product, { as: 'products', foreignKey: 'categoryId' });

Product.belongsTo(SubCategory, { as: 'subCategory', foreignKey: 'subCategoryId' });
SubCategory.hasMany(Product, { as: 'products', foreignKey: 'subCategoryId' });

Category.hasMany(SubCategory, { as: 'subCategories', foreignKey: 'categoryId' });
SubCategory.belongsTo(Category, { as: 'parentCategory', foreignKey: 'categoryId' });

module.exports = { User, Basket, BasketProduct, Product, Category, SubCategory, ProductInfo };
