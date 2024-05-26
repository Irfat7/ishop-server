const Categories = require("../models/Categories");
const { options } = require("../routes/authRoutes");

//ger products
exports.getAllofACategory = async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const categoryExists = await Categories.findOne({ name: categoryName });
    if (!categoryExists) {
      return res.send({ invalidCategory: true });
    }

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;

    const populatedCategory = await await categoryExists.populate({
      path: "products",
      options: {
        skip,
        limit,
      },
    });

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
    const { name, imageUrl } = req.body;

    const categoryExists = await Categories.findOne({ name });

    if (categoryExists) {
      return res.status(400).send({ error: "Category already exists" });
    }

    const newCategory = await Categories.create({ name, imageUrl });

    res.status(200).send(newCategory);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(401).send({
        error: "No category name added",
      });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
};
