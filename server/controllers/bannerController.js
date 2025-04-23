const {
  SubCategory,
  Category,
  Segment,
  Brand,
  Banner,
} = require("../models/model");
const ApiError = require("../error/apiError");

class BannerController {
  // Create a new subcategory

  async create(req, res, next) {
    try {
      const {
        nameTm,
        nameRu,
        nameEn,
        descriptionNameTm,
        descriptionNameRu,
        descriptionNameEn,
      } = req.body;
      // const { mobileImage, desktopImage } = req.files || {};

      // Проверка входных данных
      if (!nameTm || !nameRu || !nameEn) {
        return next(ApiError.badRequest("Banner ady giriz!"));
      }

      // Сохраняем файл
      // const imagePaths = {
      //   mobileImage: mobileImage?.[0]?.filename || null,
      //   desktopImage: desktopImage?.[0]?.filename || null,
      // };
      const mobileImage = req.files?.mobileImage?.[0]?.filename
        ? req.files.mobileImage[0].filename
        : null;
      const desktopImage = req.files?.desktopImage?.[0]?.filename
        ? req.files.desktopImage[0].filename
        : null;

      // Создаем категорию
      const banner = await Banner.create({
        nameTm,
        nameRu,
        nameEn,
        mobileImage: mobileImage,
        desktopImage: desktopImage,
        descriptionNameTm,
        descriptionNameRu,
        descriptionNameEn,
      });

      return res.json({ message: "Brand döredildi!", banner });
    } catch (e) {
      console.error(e);
      return next(ApiError.internal("Brand döretmekde ýalňyşlyk ýüze çykdy!"));
    }
  }
  // Get all subcategories with their parent categories
  async getAll(req, res, next) {
    try {
      const banners = await Banner.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        order: [["createdAt", "DESC"]],
      });
      return res.json({ message: "success", banners });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Ýalňyşlyk!"));
    }
  }
  async remove(req, res, next) {
    try {
      const { id } = req.query;

      const banner = await Banner.findByPk(id);
      if (!banner) {
        return next(ApiError.badRequest("Banner tapylmady"));
      }
      await banner.destroy();
      return res.json({ message: "Üstünlikli!" });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ýalňyşlyk!"));
    }
  }
  async update(req, res, next) {
    try {
      const {
        nameTm,
        nameRu,
        nameEn,
        id,
        isActive,
        descriptionNameTm,
        descriptionNameRu,
        descriptionNameEn,
      } = req.body;

      // Проверяем наличие ID подкатегории
      const banner = await Banner.findByPk(id);
      if (!banner) {
        return next(ApiError.badRequest("Banner tapylmady!"));
      }

      // Обновляем текстовые поля, если они указаны
      if (!nameTm || !nameRu || !nameEn || !id) {
        return next(ApiError.badRequest("Girizilen Maglumatlar ýalňyş!"));
      }
      banner.nameTm = nameTm;
      banner.nameRu = nameRu;
      banner.nameEn = nameEn;
      banner.descriptionNameTm = descriptionNameTm;
      banner.descriptionNameRu = descriptionNameRu;
      banner.descriptionNameEn = descriptionNameEn;
      banner.isActive = isActive;

      const mobileImage = req.files?.mobileImage?.[0]?.filename
        ? req.files.mobileImage[0].filename
        : null;
      const desktopImage = req.files?.desktopImage?.[0]?.filename
        ? req.files.desktopImage[0].filename
        : null;
      // Обновляем изображение, если файл предоставлен
      banner.mobileImage = mobileImage;
      banner.desktopImage = desktopImage;
      // Сохраняем изменения
      await banner.save();

      return res.json({ message: "Üstünlikli!", banner });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ýalňyşlyk ýüze çykdy!"));
    }
  }
}

module.exports = new BannerController();
