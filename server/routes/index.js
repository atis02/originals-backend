const { Router } = require('express'); // Import only the Router function
const router = Router(); // Create a new Router instance

const productRouter = require('./ProductRouter');
const categoryRouter = require('./categoryRouter');
const subCategoryRouter = require('./subCategoryRouter');
const userRouter = require('./userRouter');

router.use('/user', userRouter);
router.use('/category', categoryRouter); // Corrected spelling of 'category'
router.use('/subCategory', subCategoryRouter);
router.use('/product', productRouter);

module.exports = router;
