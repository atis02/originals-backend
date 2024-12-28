const Router = require('express')
const router = new Router()
const CategoryController = require('../controllers/categoryController')
const multer = require('multer')
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

router.patch("/update/categoryImg", upload.single("file"), CategoryController.uploadCategoryImage)
router.post('/add', upload.single('image'),CategoryController.create)
router.get('/all',CategoryController.getAll)
router.get('/getOne',CategoryController.getOne)
router.delete('/remove',CategoryController.remove)
router.patch('/update',upload.single('image'),CategoryController.update)


module.exports=router