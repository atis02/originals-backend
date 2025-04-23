const { OrderStatus } = require("../models/model");
const ApiError = require("../error/apiError");

class StatusOrdersController {
  // Create a new subcategory

  async create(req, res, next) {
    try {
      const { nameTm, nameRu, nameEn } = req.body;

      // Проверка входных данных
      if (!nameTm || !nameRu || !nameEn) {
        return next(ApiError.badRequest("Sargyt status ady giriz !"));
      }

      const status = await OrderStatus.create({
        nameTm,
        nameRu,
        nameEn,
      });

      return res.json({ message: "Sargyt status döredildi!", status });
    } catch (e) {
      console.error(e);
      return next(ApiError.internal("Sargyt status döretmekde ýalňyşlyk!"));
    }
  }
  async getAll(req, res, next) {
    try {
      const status = await OrderStatus.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        order: [["nameTm", "ASC"]],
      });

      return res.json({ message: "success", status });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Ýalňyşlyk!"));
    }
  }
  async remove(req, res, next) {
    try {
      const { id } = req.query;

      const status = await OrderStatus.findByPk(id);
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
      const { nameTm, nameRu, nameEn, id, isActive } = req.body;

      // Проверяем наличие ID подкатегории
      const status = await OrderStatus.findByPk(id);
      if (!status) {
        return next(ApiError.badRequest("Sargyt status tapylmady!"));
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

module.exports = new StatusOrdersController();
