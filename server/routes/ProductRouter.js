const Router = require('express')
const productController = require('../controllers/productController')
const router = new Router()

router.post('/',productController.create)
router.get('/'
    
)
router.get('/:id'
    
)

module.exports=router