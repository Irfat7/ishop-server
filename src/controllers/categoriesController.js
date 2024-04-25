const Categories = require("../models/Categories");

//get all products of a category
exports.getAllofACategory = async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const categoryExists = await Categories.findOne({ name: categoryName });
    if (!categoryExists) {
      return res.send({invalidCategory: true});
    }
    const populatedCategory = await categoryExists.populate("products");
    const { products: allProducts } = populatedCategory;
    res.status(200).send(allProducts);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

//get all category
exports.getAllCategory = async (req, res) => {
  try {
    const allCategories = await Categories.find();
    res.status(200).send(allCategories);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

//new category create
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const categoryExists = await Categories.findOne({ name });

    if (categoryExists) {
      return res
        .status(400)
        .send({ error: true, message: "Category already exists" });
    }

    const newCategory = await Categories.create({ name });

    res.status(200).send(newCategory);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(401).send({
        error: true,
        message: "No category name added",
      });
    }
    res.status(500).send("Internal Server Error");
  }
};
