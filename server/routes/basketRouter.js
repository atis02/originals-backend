const Router = require("express");
const subCategoryController = require("../controllers/subCategoryController");
const multer = require("multer");
const router = new Router();
const path = require("path");
const BasketController = require("../controllers/basketController");

router.post("/add", BasketController.create);
router.post("/add-products", BasketController.addToBasket);
router.get("/all", BasketController.getAll);
router.delete("/remove", BasketController.remove);
router.put("/update", BasketController.update);

module.exports = router;
