const Router = require("express");
const { SizeTable, Size } = require("../models/model");
const router = new Router();
// const CategoryController = require('../controllers/categoryController')
// const multer = require('multer')
// const path = require('path')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '../static'))
//     },
//     filename: function (req, file, cb) {
//         const uniqueFilename = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
//         cb(null, uniqueFilename);
//     }
// })
// const upload = multer({ storage: storage })

// router.patch("/update/categoryImg", upload.single("file"), CategoryController.uploadCategoryImage)
// router.post('/add', upload.single('image'),CategoryController.create)
// router.get('/all',CategoryController.getAll)
// router.get('/getOne',CategoryController.getOne)
// router.delete('/remove',CategoryController.remove)
// router.patch('/update',upload.single('image'),CategoryController.update)

router.post("/size-tables", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "size name is required" });
    }
    const sizeTable = await SizeTable.create({ name });
    res.status(201).json(sizeTable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const sizeTables = await SizeTable.findAll({
      // where: { id },
      include: {
        model: Size,
        as: "sizes",
        attributes: { exclude: ["createdAt", "updatedAt", "categoryId"] },
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.status(200).json(sizeTables);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get("/sizeTableSizes", async (req, res) => {
  try {
    const { id } = req.query;
    const sizes = await SizeTable.findOne({
      where: { id },
      include: {
        model: Size,
        as: "sizes",
        attributes: { exclude: ["createdAt", "updatedAt", "sizeTableId"] },
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.status(200).json(sizes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.put("/update", async (req, res) => {
  try {
    //   const { id } = req.params;
    const { name, id } = req.body;
    if (!name || !id) {
      return res.status(400).json({ error: "size name and id are required" });
    }
    const sizeTable = await SizeTable.findByPk(id);
    if (!sizeTable) {
      return res.status(400).json({ error: "SizeTable not found" });
    }

    sizeTable.name = name;
    await sizeTable.save();
    res.status(200).json(sizeTable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/remove", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "size name and id are required" });
    }
    const sizeTable = await SizeTable.findByPk(id);
    if (!sizeTable) {
      return res.status(400).json({ error: "SizeTable not found" });
    }
    await sizeTable.destroy();
    await Size.destroy({ where: { id: id } });

    res.status(200).send({ message: "SizeTable deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/sizes", async (req, res) => {
  try {
    const { order, sizeTableId, name } = req.body;
    const size = await Size.create({ order, sizeTableId, name });
    res.status(201).json(size);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/sizes", async (req, res) => {
  try {
    const sizes = await Size.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.status(200).json(sizes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/sizes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { order, sizeTableId, name } = req.body;
    const size = await Size.findByPk(id);
    if (!size) {
      return res.status(400).json({ error: "Size not found" });
    }
    size.order = order;
    size.sizeTableId = sizeTableId;
    size.name = name;
    await size.save();
    res.status(200).json(size);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/sizes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const size = await Size.findByPk(id);
    if (!size) {
      return res.status(400).json({ error: "Size not found" });
    }
    await size.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
