const Categories = require("../models/Categories");

//new-category-create
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .send({ error: true, message: "Category name missing" });
    }
    const categoryExists = await Categories.findOne({ name: name });

    if (categoryExists) {
      return res
        .status(400)
        .send({ error: true, message: "Category already exists" });
    }

    const newCategory = await Categories.create({ name });

    res.status(201).send(newCategory);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
