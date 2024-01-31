const Products = require("../models/Products");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, categoryId, imageUrl, quantity } = req.body;

    if (!name || !description || !categoryId || !imageUrl || !quantity) {
      return res
        .status(400)
        .send({ error: true, message: "Product info missing" });
    }

    const newProduct = new Products({
      name,
      description,
      category: categoryId,
      imageUrl,
      quantity,
    });

    console.log(newProduct);

    await newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

/* exports.searchProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
}; */
