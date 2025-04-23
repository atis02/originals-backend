const { SubCategory, Segment } = require("../models/model");
const ApiError = require("../error/apiError");

class SegmentController {
  // Create a new subcategory

  async create(req, res, next) {
    try {
      const { nameTm, nameRu, nameEn, subCategoryId } = req.body;
      const file = req.file;
      console.log(file);

      // Проверка входных данных
      if (!nameTm || !nameRu || !nameEn || !subCategoryId) {
        return next(
          ApiError.badRequest("Segment ady giriz ýada Subkategoriýa ýalňyş!")
        );
      }
      const existCategory = await SubCategory.findByPk(subCategoryId);
      if (!existCategory) {
        return next(ApiError.notFound("subKategoriýa tapylmady!"));
      }
      // Сохраняем файл
      let fileName = null;
      if (file) {
        fileName = file.filename;
      }

      // Создаем категорию
      const subCategory = await Segment.create({
        nameTm,
        nameRu,
        nameEn,
        image: fileName,
        subCategoryId,
      });

      return res.json({ message: "Segment döredildi!", subCategory });
    } catch (e) {
      console.error(e);
      return next(
        ApiError.internal("Segment döretmekde ýalňyşlyk ýüze çykdy!")
      );
    }
  }
  // Get all subcategories with their parent categories
  async getAll(req, res, next) {
    try {
      const segments = await Segment.findAll({
        include: {
          model: SubCategory,
          as: "parentSubCategory",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        }, // Use the correct alias
        attributes: { exclude: ["createdAt", "updatedAt"] },
        order: [["nameTm", "ASC"]],
      });

      return res.json({ message: "success", segments });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Ýalňyşlyk!"));
    }
  }
  async remove(req, res, next) {
    try {
      const { id } = req.query;

      const segment = await Segment.findByPk(id);
      if (!segment) {
        return next(ApiError.badRequest("Segment tapylmady"));
      }
      await segment.destroy();
      return res.json({ message: "Üstünlikli!" });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ýalňyşlyk!"));
    }
  }
  async update(req, res, next) {
    try {
      const { nameTm, nameRu, nameEn, id, subCategoryId, isActive } = req.body;
      const file = req.file;

      // Проверяем наличие ID подкатегории
      const segment = await Segment.findByPk(id);
      if (!segment) {
        return next(ApiError.badRequest("Segment tapylmady!"));
      }

      // Обновляем текстовые поля, если они указаны
      if (!nameTm || !nameRu || !nameEn || !id || !subCategoryId) {
        return next(ApiError.badRequest("Girizilen Maglumatlar ýalňyş!"));
      }
      segment.nameTm = nameTm;
      segment.nameRu = nameRu;
      segment.nameEn = nameEn;
      segment.subCategoryId = subCategoryId;
      segment.isActive = isActive;

      // Обновляем изображение, если файл предоставлен
      if (file) {
        const fileName = file.filename;
        segment.image = fileName;
      }

      // Сохраняем изменения
      await segment.save();

      return res.json({ message: "Üstünlikli!", segment });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ýalňyşlyk ýüze çykdy!"));
    }
  }
}

module.exports = new SegmentController();
