const Router = require("express");
const router = new Router();
const StatusOrdersController = require("../controllers/statusOrdersController");

router.post("/new", StatusOrdersController.create);
router.get("/all", StatusOrdersController.getAll);
router.delete("/remove", StatusOrdersController.remove);
router.put("/update", StatusOrdersController.update);

module.exports = router;
