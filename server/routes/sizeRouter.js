const Router = require("express");
const { SizeTable, Size, SizeTableType } = require("../models/model");
const ApiError = require("../error/apiError");
const router = new Router();

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
router.post("/size-table-types", async (req, res) => {
  try {
    const { sizeTableId, name } = req.body;

    if (!name || !sizeTableId) {
      return res
        .status(400)
        .json({ error: "size or sizeTableId  is required" });
    }
    const sizeTable = await SizeTableType.create({ name, sizeTableId });
    res.status(201).json(sizeTable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/size-table-types/update", async (req, res, next) => {
  try {
    const { name, id } = req.body;

    if (!name || !id) {
      return res
        .status(400)
        .json({ error: "size or sizeTableId  is required" });
    }
    existSizeTable = await SizeTableType.findByPk(id);
    if (!existSizeTable) {
      return next(ApiError.notFound(`SizeTableType is not defined`));
    }
    const sizeTable = await SizeTableType.update(
      { name: name }, // Values to update
      { where: { id: id } }
    );
    res.status(201).json(sizeTable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// router.get("/all", async (req, res) => {
//   try {
//     const sizeTables = await SizeTable.findAll({
//       // where: { id },
//       include: {
//         model: SizeTableType,
//         as: "types",
//         attributes: { exclude: ["createdAt", "updatedAt", "categoryId"] },
//       },
//       attributes: { exclude: ["createdAt", "updatedAt"] },
//     });
//     res.status(200).json(sizeTables);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
router.get("/all", async (req, res) => {
  try {
    const sizeTables = await SizeTable.findAll({
      include: {
        model: SizeTableType,
        as: "types",
        attributes: { exclude: ["createdAt", "updatedAt", "sizeTableId"] }, // Corrected categoryId to sizeTableId
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    // Sort the "types" array within each sizeTable
    const sortedSizeTables = sizeTables.map((sizeTable) => {
      return {
        ...sizeTable.toJSON(), // Convert to plain object to avoid Sequelize issues
        types: sizeTable.types.sort((a, b) => {
          const nameA = parseInt(a.name, 10);
          const nameB = parseInt(b.name, 10);
          return nameA - nameB;
        }),
      };
    });

    res.status(200).json(sortedSizeTables);
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
