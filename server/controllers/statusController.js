const {  Status } = require('../models/model');
const ApiError = require('../error/apiError');

class StatusController {
    // Create a new subcategory
  
    async create(req, res, next) {
        try {
            const { nameTm, nameRu, nameEn } = req.body;
    
            // Проверка входных данных
            if (!nameTm || !nameRu || !nameEn ) {
                return next(ApiError.badRequest('Segment ady giriz !'));
            }
    
            // Создаем категорию
            const status = await Status.create({
                nameTm,
                nameRu,
                nameEn,
            });
    
            return res.json({ message: 'status döredildi!', status });
        } catch (e) {
            console.error(e);
            return next(ApiError.internal('status döretmekde ýalňyşlyk ýüze çykdy!'));
        }
    }
    // Get all subcategories with their parent categories
    async getAll(req, res,next) {
        try {
            const status = await Status.findAll({
                 attributes: { exclude: ['createdAt', 'updatedAt'] },
                 order: [['nameTm', 'ASC']] 
            });

            return res.json({message:'success',status});
        } catch (e) {
            console.error(e);
            return next(ApiError.badRequest('Ýalňyşlyk!'))
        }
    }
    async remove (req, res,next) {
        try {
            const { id } = req.query;

            const status = await Status.findByPk(id);
            if(!status){
                return next(ApiError.badRequest('status tapylmady'))
            }
            await status.destroy();
            return res.json({ message: 'Üstünlikli!' });
        } catch (error) {
            console.error(error);
            return next(ApiError.internal('Ýalňyşlyk!'));
        }
    }
    async update(req, res, next) {
        try {
            const { nameTm, nameRu, nameEn, id ,isActive} = req.body;
    
            // Проверяем наличие ID подкатегории
            const status = await Status.findByPk(id);
            if (!status) {
                return next(ApiError.badRequest('status tapylmady!'));
            }
    
            // Обновляем текстовые поля, если они указаны
            if(!nameTm||!nameRu||!nameEn||!id){
                return next(ApiError.badRequest('Girizilen Maglumatlar ýalňyş!'));
            }
             status.nameTm = nameTm;
             status.nameRu = nameRu;
             status.nameEn = nameEn;
             status.isActive = isActive;
    
            // Обновляем изображение, если файл предоставлен
        
    
            // Сохраняем изменения
            await status.save();
    
            return res.json({ message: 'Üstünlikli!', status });
        } catch (error) {
            console.error(error);
            return next(ApiError.internal('Ýalňyşlyk ýüze çykdy!'));
        }
    }
    
}

module.exports = new StatusController();
