const Router = require('express')
const multer = require('multer')
const router = new Router()
const path = require('path')
const brandController = require('../controllers/brandController')

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
router.post('/add',upload.single('image'),brandController.create)
router.get('/all',brandController.getAll)
router.delete('/remove',brandController.remove)
router.put('/update',upload.single('image'),brandController.update)

module.exports=router