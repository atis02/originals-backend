const { Router } = require("express"); // Import only the Router function
const router = Router(); // Create a new Router instance

const productRouter = require("./ProductRouter");
const categoryRouter = require("./categoryRouter");
const subCategoryRouter = require("./subCategoryRouter");
const userRouter = require("./userRouter");
const sizeRouter = require("./sizeRouter");
const segmentRouter = require("./segmentRouter");
const brandRouter = require("./brandRouter");
const statusRouter = require("./statusRouter");
const orderRouter = require("./orderRouter");
const basketRouter = require("./basketRouter");
const bannerRouter = require("./bannerRouter");
const statusOrder = require("./statusOrders");
const deliveryCity = require("./deliveryCityRouter");

router.use("/user", userRouter);
router.use("/category", categoryRouter); // Corrected spelling of 'category'
router.use("/subCategory", subCategoryRouter);
router.use("/segment", segmentRouter);
router.use("/brand", brandRouter);
router.use("/status", statusRouter);
router.use("/product", productRouter);
router.use("/size", sizeRouter);
router.use("/order", orderRouter);
router.use("/order/status", statusOrder);
router.use("/order/deliveryCity", deliveryCity);
router.use("/basket", basketRouter);
router.use("/banner", bannerRouter);
module.exports = router;
