const Router = require("express");
const deliveryCityController = require("../controllers/deliveryCityController");
const router = new Router();

router.post("/add", deliveryCityController.create);
router.get("/all", deliveryCityController.getAll);
router.delete("/remove", deliveryCityController.remove);
router.put("/update", deliveryCityController.update);

module.exports = router;
