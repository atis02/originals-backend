const { Router } = require('express'); // Import only the Router function
const router = Router(); // Create a new Router instance

const productRouter = require('./ProductRouter');
const categoryRouter = require('./categoryRouter');
const subCategoryRouter = require('./subCategoryRouter');
const userRouter = require('./userRouter');
const sizeRouter =require('./sizeRouter')
const segmentRouter = require('./segmentRouter')
const statusRouter = require('./statusRouter')

router.use('/user', userRouter);
router.use('/category', categoryRouter); // Corrected spelling of 'category'
router.use('/subCategory', subCategoryRouter);
router.use('/segment', segmentRouter);
router.use('/status', statusRouter);
router.use('/product', productRouter);
router.use('/size', sizeRouter);
module.exports = router;


  