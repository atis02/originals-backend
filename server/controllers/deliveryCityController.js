const { OrderStatus, OrderDeliveryCityPayment } = require("../models/model");
const ApiError = require("../error/apiError");

class DeliveryCityController {
  // Create a new subcategory

  async create(req, res, next) {
    try {
      const { nameTm, nameRu, nameEn, deliveryPrice } = req.body;

      // Проверка входных данных
      if (!nameTm || !nameRu || !nameEn || !deliveryPrice) {
        return next(
          ApiError.badRequest(
            "Sargyt şäher ady ýa-da eltip berme hyzmaty üçin töleg möçberi giriz!"
          )
        );
      }

      const status = await OrderDeliveryCityPayment.create({
        nameTm,
        nameRu,
        nameEn,
        deliveryPrice,
      });

      return res.json({ message: "Üstünlikli döredildi!", status });
    } catch (e) {
      console.error(e);
      return next(ApiError.internal("Döretmekde ýalňyşlyk!"));
    }
  }
  async getAll(req, res, next) {
    try {
      const deliveryPrice = await OrderDeliveryCityPayment.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        order: [["nameTm", "ASC"]],
      });

      return res.json({ message: "success", deliveryPrice });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Ýalňyşlyk!"));
    }
  }
  async remove(req, res, next) {
    try {
      const { id } = req.query;

      const status = await OrderDeliveryCityPayment.findByPk(id);
      if (!status) {
        return next(ApiError.badRequest("Sargyt status tapylmady"));
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
      const { nameTm, nameRu, nameEn, id, isActive, deliveryPrice } = req.body;

      // Проверяем наличие ID подкатегории
      const status = await OrderDeliveryCityPayment.findByPk(id);
      if (!status) {
        return next(ApiError.badRequest("Sargyt Saher toleg tapylmady!"));
      }

      // Обновляем текстовые поля, если они указаны
      if (!nameTm || !nameRu || !nameEn || !id) {
        return next(ApiError.badRequest("Girizilen Maglumatlar ýalňyş!"));
      }
      status.nameTm = nameTm;
      status.nameRu = nameRu;
      status.nameEn = nameEn;
      status.deliveryPrice = deliveryPrice;
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

module.exports = new DeliveryCityController();
