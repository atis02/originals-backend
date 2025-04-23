const { SubCategory, Category, Segment, Brand } = require('../models/model');
const ApiError = require('../error/apiError');

class BrandController {
    // Create a new subcategory
  
    async create(req, res, next) {
        try {
            const { nameTm, nameRu, nameEn } = req.body;
            const file = req.file;
            console.log(file);
    
            // Проверка входных данных
            if (!nameTm || !nameRu || !nameEn ) {
                return next(ApiError.badRequest('Brand ady giriz!'));
            }
    
            // Сохраняем файл
            let fileName = null;
            if (file) {
                fileName = file.filename;
            }
    
            // Создаем категорию
            const brand = await Brand.create({
                nameTm,
                nameRu,
                nameEn,
                image: fileName, 
            });
    
            return res.json({ message: 'Brand döredildi!', brand });
        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Brand döretmekde ýalňyşlyk ýüze çykdy!'));
        }
    }
    // Get all subcategories with their parent categories
    async getAll(req, res,next) {
        try {
            const brands = await Brand.findAll({
                 attributes: { exclude: ['createdAt', 'updatedAt'] },
                 order: [['nameTm', 'ASC']] 
            });

            return res.json({message:'success',brands});
        } catch (e) {
            console.error(e);
            return next(ApiError.badRequest('Ýalňyşlyk!'))
        }
    }
    async remove (req, res,next) {
        try {
            const { id } = req.query;

            const brand = await Brand.findByPk(id);
            if(!brand){
                return next(ApiError.badRequest('Brand tapylmady'))
            }
            await brand.destroy();
            return res.json({ message: 'Üstünlikli!' });
        } catch (error) {
            console.error(error);
            return next(ApiError.internal('Ýalňyşlyk!'));
        }
    }
    async update(req, res, next) {
        try {
            const { nameTm, nameRu, nameEn, id ,isActive} = req.body;
            const file = req.file;
    
            // Проверяем наличие ID подкатегории
            const brand = await Brand.findByPk(id);
            if (!brand) {
                return next(ApiError.badRequest('Brand tapylmady!'));
            }
    
            // Обновляем текстовые поля, если они указаны
            if(!nameTm||!nameRu||!nameEn||!id){
                return next(ApiError.badRequest('Girizilen Maglumatlar ýalňyş!'));
            }
             brand.nameTm = nameTm;
             brand.nameRu = nameRu;
             brand.nameEn = nameEn;
             brand.isActive = isActive;
    
            // Обновляем изображение, если файл предоставлен
            if (file) {
                const fileName = file.filename;
                brand.image = fileName;
            }
    
            // Сохраняем изменения
            await brand.save();
    
            return res.json({ message: 'Üstünlikli!', brand });
        } catch (error) {
            console.error(error);
            return next(ApiError.internal('Ýalňyşlyk ýüze çykdy!'));
        }
    }
    
}

module.exports = new BrandController();
