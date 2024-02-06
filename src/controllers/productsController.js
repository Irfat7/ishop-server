const Products = require("../models/Products");

//add-a-new-product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, imageUrl, quantity } = req.body;

    if (!name || !description || !category || !imageUrl || !quantity) {
      return res
        .status(400)
        .send({ error: true, message: "Product info missing" });
    }

    const newProduct = new Products({
      name,
      description,
      category: category,
      imageUrl,
      quantity,
    });

    await newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

//get-specific-product
exports.getSpecificProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Products.findOne({ _id: productId });

    if (!product) throw Error;

    res.status(201).send(product);
  } catch (error) {
    if (error.name === "CastError" || error.name === "Error") {
      return res
        .status(404)
        .send({ error: true, message: "Product not found" });
    }
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

//get-all-products
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const results = await Products.find()
      .skip(page - 1)
      .limit(pageSize)
      .populate("category");

    res.status(201).send(results);
  } catch (error) {
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

//update-product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, description, category, imageUrl, quantity } = req.body;

    if (!name || !description || !category || !imageUrl || !quantity) {
      return res
        .status(400)
        .send({ error: true, message: "Product info missing" });
    }

    const existingProduct = await Products.findOne({ _id: productId });

    if (!existingProduct) {
      return res
        .status(404)
        .send({ error: true, message: "Product not found" });
    }

    Object.assign(existingProduct, req.body);

    const updatedProduct = await existingProduct.save();

    res.status(201).send(updatedProduct);
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .send({ error: true, message: "Invalid ProductId" });
    } else if (error.name === "Error") {
      return res
        .status(404)
        .send({ error: true, message: "Category not found" });
    }

    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};
