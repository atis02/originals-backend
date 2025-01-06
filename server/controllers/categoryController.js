const {Category, SubCategory} = require ('../models/model')
const ApiError = require('../error/apiError')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs');

class CategoryController {
    // async create(req,res,next){
    //     try {
    //         const { nameTm,nameRu,nameEn } = req.body;
    //         const file = req.file;
    //         console.log(file);

         
    //         if (!nameTm||!nameRu||!nameEn ) {
    //             return next(ApiError.badRequest('Kategoriýa ady giriz!'));
    //         }

    //         // Create the subcategory
    //         const category = await Category.create({ nameTm,nameRu,nameEn,img:file});
    //         return res.json({message:'success', category: category});
    //     } catch (e) {
    //         console.error(e);
    //         return next(ApiError.internal('Error creating subcategory'));
    //     }
    // }
    async create(req, res, next) {
        try {
            const { nameTm, nameRu, nameEn } = req.body;
            const file = req.file;
    console.log(file);
    
            // Проверка входных данных
            if (!nameTm || !nameRu || !nameEn) {
                return next(ApiError.badRequest('Kategoriýa ady giriz!'));
            }
    
            // Сохраняем файл
            let fileName = null;
            if (file) {
                fileName = file.filename;
            }
    
            // Создаем категорию
            const category = await Category.create({
                nameTm,
                nameRu,
                nameEn,
                image: fileName, // Сохраняем имя файла в базе
            });
    
            return res.json({ message: 'Kategoriýa döredildi!', category });
        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Kategoriýa döretmekde ýalňyşlyk ýüze çykdy, duyduranyn ucin sag bol bratok'  + e));
        }
    }
    
    async getAll(req,res,next){
        try {
            const categories=  await  Category.findAll({
                include: { model: SubCategory, as: 'subCategories',
                    attributes: { exclude: ['createdAt', 'updatedAt','categoryId'] },

                 },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                order: [['nameTm', 'ASC']] 
            })
            return res.status(200).json(categories);
        } catch (e) {
            // return res.status(500).json("Not found users");
            console.log(e);
            
            return next(ApiError.badRequest('Kategoriýa tapylmady'))
        }

    }
    async remove(req, res, next) {
        try {
            const { id } = req.query;

            // Check if the category exists
            const category = await Category.findByPk(id);
            if (!category) {
                return next(ApiError.badRequest('Kategoriýa tapylmady!'));
            }

            // Delete the category
            await category.destroy();

            // Optionally, you can also delete related subcategories if needed
            await SubCategory.destroy({ where: { categoryId: id } });

            return res.json({ message: 'Üstünlikli!' });
        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Ýalňyşlyk!'));
        }
    }

    async update(req, res, next) {
        try {
            const { nameTm,nameRu,nameEn ,id,isActive } = req.body;
            const file = req.file;
    
            // Проверяем наличие ID подкатегории
            const category = await Category.findByPk(id);
            if (!category) {
                return next(ApiError.badRequest('Kategoriýa tapylmady!'));
            }
    
            // Обновляем текстовые поля, если они указаны
            if(!nameTm||!nameRu||!nameEn||!id){
                return next(ApiError.badRequest('Girizilen Maglumatlar ýalňyş!'));
            }
             category.nameTm = nameTm;
             category.nameRu = nameRu;
             category.nameEn = nameEn;
             category.isActive = isActive;
    
            // Обновляем изображение, если файл предоставлен
            if (file) {
                const fileName = file.filename;
                category.image = fileName;
            }
    
            // Сохраняем изменения
            await category.save();
    
            return res.json({ message: 'Üstünlikli!', category });
        } catch (error) {
            console.error(error);
            return next(ApiError.internal('Ýalňyşlyk ýüze çykdy!'));
        }
    }
    async getOne(req, res, next) {
        try {
            const { id } = req.query;
    console.log(id);
    
            // Find the category by its ID
            const category = await Category.findOne({
                where: { id },
                include: {
                    model: SubCategory,
                    as: 'subCategories',
                    attributes: { exclude: ['createdAt', 'updatedAt', 'categoryId'] },
                },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            });
    
            if (!category) {
                return next(ApiError.badRequest('Category not found'));
            }
    
            return res.status(200).json(category);
        } catch (e) {
            console.error("Error retrieving category:", e);  // Log the actual error
            return next(ApiError.internal('Error retrieving category'));
        }
    }
    async uploadCategoryImage(req, res, next) {
        try {
            const { categoryId } = req.body;
            const file = req.file?.filename; // Убедитесь, что файл существует
    
            // Проверяем наличие категории
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return next(ApiError.badRequest('Kategoriýa tapylmady!'));
            }
    
            // Проверяем, указаны ли нужные данные
            if (!categoryId || !file) {
                return next(ApiError.badRequest('Maglumatlary giriz!'));
            }
    
            // Удаляем старое изображение, если оно существует
            if (category.image) {
                const imgPath = path.join(__dirname, "..", 'static', category.image);
                fs.unlink(imgPath, (err) => {
                    if (err && err.code !== 'ENOENT') {
                        console.error('Ошибка при удалении файла:', err);
                    } else {
                        console.log('Старое изображение успешно удалено');
                    }
                });
            }
    
            // Обновляем изображение в базе данных
            category.image = file;
            await category.save();
    
            return res.json({ message: 'Üstünlikli!', category });
        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Ýalňyşlyk!'));
        }
    }
    
}
module.exports = new CategoryController ()
