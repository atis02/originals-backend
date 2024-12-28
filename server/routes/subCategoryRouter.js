const Router = require('express')
const subCategoryController = require('../controllers/subCategoryController')
const multer = require('multer')
const router = new Router()
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../static'))
    },
    filename: function (req, file, cb) {
        const uniqueFilename = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
        cb(null, uniqueFilename);
    }
})
const upload = multer({ storage: storage })

// router.patch("/update/subcategoryImg", upload.single("file"), subCategoryController.uploadCategoryImage)
router.post('/add',upload.single('image'),subCategoryController.create)
router.get('/all',subCategoryController.getAll)
router.delete('/remove',subCategoryController.remove)
router.put('/update',upload.single('image'),subCategoryController.update)

module.exports=router