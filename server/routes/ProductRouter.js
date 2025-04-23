const Router = require("express");
const productController = require("../controllers/productController");
const router = new Router();

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../static"));
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${Date.now()}_${file.originalname.replace(
      /\s+/g,
      "_"
    )}`;
    cb(null, uniqueFilename);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/add",
  upload.fields([
    { name: "minImage", maxCount: 1 },
    { name: "hoverImage", maxCount: 1 },
    { name: "imageOne", maxCount: 1 },
    { name: "imageTwo", maxCount: 1 },
    { name: "imageThree", maxCount: 1 },
    { name: "imageFour", maxCount: 1 },
    { name: "imageFive", maxCount: 1 },
  ]),
  productController.create
);
router.post(
  "/add/newColor",
  upload.fields([
    { name: "minImage", maxCount: 1 },
    { name: "hoverImage", maxCount: 1 },
    { name: "fullImages", maxCount: 6 },
  ]),
  productController.addColorDetail
);
router.post(
  "/newColor",
  upload.fields([
    { name: "minImage", maxCount: 1 },
    { name: "hoverImage", maxCount: 1 },
    { name: "imageOne", maxCount: 1 },
    { name: "imageTwo", maxCount: 1 },
    { name: "imageThree", maxCount: 1 },
    { name: "imageFour", maxCount: 1 },
    { name: "imageFive", maxCount: 1 },
  ]),
  productController.addColorDetail
);
router.get("/all", productController.getAll);
router.get("/getOne", productController.getOne);
router.get("/getOneProductColor", productController.getOneProductColor);

router.delete("/remove", productController.deleteProduct);
router.delete("/removeColorDetails", productController.deleteColorDetail);

router.put("/updateProduct", productController.updateProduct);
router.put(
  "/update",
  upload.fields([
    { name: "minImage", maxCount: 1 },
    { name: "hoverImage", maxCount: 1 },
    { name: "imageOne", maxCount: 1 },
    { name: "imageTwo", maxCount: 1 },
    { name: "imageThree", maxCount: 1 },
    { name: "imageFour", maxCount: 1 },
    { name: "imageFive", maxCount: 1 },
  ]),
  productController.updateProductDetails
);

module.exports = router;
