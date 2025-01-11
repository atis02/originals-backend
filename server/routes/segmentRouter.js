const Router = require('express')
const subCategoryController = require('../controllers/subCategoryController')
const multer = require('multer')
const router = new Router()
const path = require('path')
const segmentController = require('../controllers/segmentController')

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
router.post('/add',upload.single('image'),segmentController.create)
router.get('/all',segmentController.getAll)
router.delete('/remove',segmentController.remove)
router.put('/update',upload.single('image'),segmentController.update)

module.exports=router