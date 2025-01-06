const Router = require('express')
const productController = require('../controllers/productController')
const router = new Router()

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

// router.post('/',productController.create)
// router.get('/')
// router.get('/:id')

router.post('/add', upload.fields([
    { name: 'minImage', maxCount: 1 },
    { name: 'hoverImage', maxCount: 1 },
    { name: 'fullImages', maxCount: 9 },
]), productController.create);

  router.get('/all', productController.getAll);  // Assuming getAll is implemented
//   router.get('/:id', productController.getOne); 
module.exports=router