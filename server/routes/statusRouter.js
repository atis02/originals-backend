const Router = require('express')
const subCategoryController = require('../controllers/subCategoryController')
const multer = require('multer')
const router = new Router()
const path = require('path')
const StatusController = require('../controllers/statusController')

router.post('/add',StatusController.create)
router.get('/all',StatusController.getAll)
router.delete('/remove',StatusController.remove)
router.put('/update',StatusController.update)

module.exports=router