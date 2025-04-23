const { SubCategory, Category } = require("../models/model");
const ApiError = require("../error/apiError");

class SubCategoryController {
  // Create a new subcategory

  async create(req, res, next) {
    try {
      const { nameTm, nameRu, nameEn, categoryId } = req.body;
      const file = req.file;
      console.log(file);

      // Проверка входных данных
      if (!nameTm || !nameRu || !nameEn || !categoryId) {
        return next(
          ApiError.notFound("Subkategoriýa ady giriz ýada kategoriýa ýalňyş!")
        );
      }
      const existCategory = await Category.findByPk(categoryId);
      if (!existCategory) {
        return next(ApiError.notFound("Kategoriýa tapylmady!"));
      }

      // Сохраняем файл
      let fileName = null;
      if (file) {
        fileName = file.filename;
      }

      // Создаем категорию
      const subCategory = await SubCategory.create({
        nameTm,
        nameRu,
        nameEn,
        image: fileName,
        categoryId,
      });

      return res.json({ message: "Subkategoriýa döredildi!", subCategory });
    } catch (e) {
      console.error(e);
      return next(
        ApiError.internal("Subkategoriýa döretmekde ýalňyşlyk ýüze çykdy!")
      );
    }
  }
  // Get all subcategories with their parent categories
  async getAll(req, res, next) {
    try {
      const subCategories = await SubCategory.findAll({
        include: {
          model: Category,
          as: "parentCategory",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        }, // Use the correct alias
        attributes: { exclude: ["createdAt", "updatedAt"] },
        order: [["nameTm", "ASC"]],
      });

      return res.json({ message: "success", subCategories });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Ýalňyşlyk!"));
    }
  }
  async remove(req, res, next) {
    try {
      const { id } = req.query;

      const subCategory = await SubCategory.findByPk(id);
      if (!subCategory) {
        return next(ApiError.badRequest("Subkategoriýa tapylmady"));
      }
      await subCategory.destroy();
      return res.json({ message: "Üstünlikli!" });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ýalňyşlyk!"));
    }
  }
  async update(req, res, next) {
    try {
      const { nameTm, nameRu, nameEn, id, categoryId, isActive } = req.body;
      const file = req.file;

      // Проверяем наличие ID подкатегории
      const subCategory = await SubCategory.findByPk(id);
      if (!subCategory) {
        return next(ApiError.badRequest("Subkategoriýa tapylmady!"));
      }

      // Обновляем текстовые поля, если они указаны
      if (!nameTm || !nameRu || !nameEn || !id || !categoryId) {
        return next(ApiError.badRequest("Girizilen Maglumatlar ýalňyş!"));
      }
      subCategory.nameTm = nameTm;
      subCategory.nameRu = nameRu;
      subCategory.nameEn = nameEn;
      subCategory.categoryId = categoryId;
      subCategory.isActive = isActive;

      // Обновляем изображение, если файл предоставлен
      if (file) {
        const fileName = file.filename;
        subCategory.image = fileName;
      }

      // Сохраняем изменения
      await subCategory.save();

      return res.json({ message: "Üstünlikli!", subCategory });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ýalňyşlyk ýüze çykdy!"));
    }
  }
}

module.exports = new SubCategoryController();
