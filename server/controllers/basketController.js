const {
  Status,
  Basket,
  User,
  Product,
  ProductColorDetails,
  BasketProduct,
  SizeTable,
  Size,
} = require("../models/model");
const ApiError = require("../error/apiError");

class BasketController {
  // Create a new subcategory

  async create(req, res, next) {
    try {
      const { userId } = req.body;

      // Проверка входных данных
      if (!userId) {
        return next(ApiError.badRequest("Ulanyjy id giriz !"));
      }
      const userExist = User.findByPk(userId);
      if (userExist) {
        const basket = await Basket.create({
          userId,
        });

        return res.json({ message: "Sebet döredildi!", basket });
      } else {
        return next(ApiError.badRequest("Ulanyjy ulgamda ýok !"));
      }
    } catch (e) {
      console.error(e);
      return next(ApiError.internal("Sebet döretmekde ýalňyşlyk ýüze çykdy!"));
    }
  }
  async addToBasket(req, res, next) {
    try {
      const { userId, productColorId, quantity, sizeId } = req.body;

      if (!productColorId || !quantity || !userId || !sizeId) {
        return next(ApiError.notFound("Required fields!"));
      }

      const existSize = await Size.findByPk(sizeId);
      if (!existSize) {
        return next(ApiError.notFound("Size not found!"));
      }

      let basket = await Basket.findOne({ where: { userId } });

      if (!basket) {
        basket = await Basket.create({ userId });
        console.log("New basket created for user:", userId);
      }

      const product = await ProductColorDetails.findByPk(productColorId, {
        include: [{ model: Size, as: "sizes" }],
      });

      if (!product) {
        return next(ApiError.notFound("Product not found!"));
      }

      // Находим размер товара
      const productSize = product.sizes.find((size) => size.id === sizeId);
      if (!productSize) {
        return next(ApiError.notFound("Size not found for this product!"));
      }

      // Проверяем доступное количество
      if (productSize.quantity < quantity) {
        return next(ApiError.badRequest("Not enough stock available!"));
      }

      let basketProduct = await BasketProduct.findOne({
        where: { basketId: basket.id, productColorId, sizeId },
      });

      if (basketProduct) {
        const newQuantity = basketProduct.productQuantity + quantity;

        // Проверяем, можно ли добавить нужное количество
        if (newQuantity > productSize.quantity) {
          return next(ApiError.badRequest("Not enough stock available!"));
        }

        basketProduct.productQuantity = newQuantity;
        basketProduct.totalPrice = newQuantity * product.sellPrice; // Обновляем цену
        await basketProduct.save();
      } else {
        await BasketProduct.create({
          basketId: basket.id,
          productColorId,
          productQuantity: quantity,
          totalPrice: quantity * product.sellPrice, // Общая цена
          sizeId,
        });
      }

      return res.json({ message: "Üstünlikli!" });
    } catch (error) {
      console.error("Error adding to basket:", error);
      return next(ApiError.internal("Error adding to basket"));
    }
  }

  // async addToBasket(req, res, next) {
  //   try {
  //     const { userId, productColorId, quantity, sizeId } = req.body;
  //     if (!productColorId || !quantity || !userId || !sizeId) {
  //       return next(ApiError.notFound("Required fields!"));
  //     }
  //     const existSize = await Size.findByPk(sizeId);
  //     if (!existSize) {
  //       return next(ApiError.notFound("Size not found!"));
  //     }
  //     let basket = await Basket.findOne({
  //       where: { userId: userId },
  //     });

  //     if (!basket) {
  //       basket = await Basket.create({
  //         userId: userId,
  //         productColorDetailId: productColorId,
  //       });
  //       console.log("New basket created for user:", userId);
  //     }

  //     const product = await ProductColorDetails.findByPk(productColorId);
  //     if (!product) {
  //       return "Product not found";
  //     }

  //     let basketProduct = await BasketProduct.findOne({
  //       where: {
  //         basketId: basket.id,
  //         productColorId: productColorId,
  //       },
  //     });

  //     if (basketProduct) {
  //       basketProduct.productQuantity += quantity;
  //       basketProduct.sizeId = sizeId;
  //       await basketProduct.save();
  //       return res.json({ message: "Üstünlikli!" });
  //     } else {
  //       await BasketProduct.create({
  //         basketId: basket.id,
  //         productColorId: productColorId,
  //         productQuantity: quantity,
  //         totalPrice: product.sellPrice, // Цена продукта
  //         sizeId: sizeId,
  //       });
  //       return res.json({ message: "Üstünlikli!" });
  //     }
  //   } catch (error) {
  //     console.error("Error adding to basket:", error);
  //     return "Error adding to basket";
  //   }
  // }
  // async add(req, res, next) {
  //   try {
  //     const {
  //       basketId,
  //       productId,
  //       productColorId,
  //       quantity,
  //       // sizeTableId,
  //       // sizeId,
  //     } = req.body;

  //     if (
  //       (!basketId, !productId, !productColorId, !quantity)
  //       // !sizeTableId,
  //       // !sizeId
  //     ) {
  //       return res.status(404).json({ error: "Required fields!" });
  //     }
  //     const basket = await Basket.findByPk(basketId);
  //     if (!basket) {
  //       return res.status(404).json({ error: "Basket not found" });
  //     }

  //     // Check if the product exists
  //     const product = await Product.findByPk(productId);
  //     if (!product) {
  //       return res.status(404).json({ error: "Product not found" });
  //     }
  //     const productColor = await ProductColorDetails.findByPk(productColorId);
  //     if (!productColor) {
  //       return res
  //         .status(404)
  //         .json({ error: "Product Color Detail not found" });
  //     }
  //     //   const sizeTable = await SizeTable.findByPk(sizeTableId);
  //     //   if (!sizeTable) {
  //     //     return res.status(404).json({ error: "SizeTable not found" });
  //     //   }
  //     //   const size = await Size.findByPk(sizeId);
  //     //   if (!size) {
  //     //     return res.status(404).json({ error: "Size not found" });
  //     //   }
  //     // Calculate the total price (assuming product has a price field)
  //     const totalPrice = quantity * productColor.sellPrice;

  //     // Create the BasketProduct
  //     const basketProduct = await BasketProduct.create({
  //       basketId,
  //       productId,
  //       productColorId,
  //       quantity,
  //       totalPrice,
  //       // sizeTableId,
  //       // sizeId,
  //     });

  //     res.status(201).json({
  //       message: "Basket product added successfully",
  //       data: basketProduct,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // }
  // Get all subcategories with their parent categories
  async getAll(req, res, next) {
    try {
      const status = await Basket.findAll({
        include: [
          {
            model: BasketProduct,
            as: "basketProducts",
          },
          {
            model: ProductColorDetails,
            as: "productColorDetail",
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        // order: [["nameTm", "ASC"]],
      });

      return res.json(status);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Ýalňyşlyk!"));
    }
  }
  async remove(req, res, next) {
    try {
      const { id } = req.query;

      const status = await Status.findByPk(id);
      if (!status) {
        return next(ApiError.badRequest("status tapylmady"));
      }
      await status.destroy();
      return res.json({ message: "Üstünlikli!" });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ýalňyşlyk!"));
    }
  }
  async update(req, res, next) {
    try {
      const { nameTm, nameRu, nameEn, id, isActive } = req.body;

      // Проверяем наличие ID подкатегории
      const status = await Status.findByPk(id);
      if (!status) {
        return next(ApiError.badRequest("status tapylmady!"));
      }

      // Обновляем текстовые поля, если они указаны
      if (!nameTm || !nameRu || !nameEn || !id) {
        return next(ApiError.badRequest("Girizilen Maglumatlar ýalňyş!"));
      }
      status.nameTm = nameTm;
      status.nameRu = nameRu;
      status.nameEn = nameEn;
      status.isActive = isActive;

      // Обновляем изображение, если файл предоставлен

      // Сохраняем изменения
      await status.save();

      return res.json({ message: "Üstünlikli!", status });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ýalňyşlyk ýüze çykdy!"));
    }
  }
}

module.exports = new BasketController();
