const Products = require("../models/Products");

//add-a-new-product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, features, category, imageUrl, quantity } = req.body;

    const newProduct = new Products({
      name,
      price,
      features,
      category,
      imageUrl,
      quantity,
    });

    await newProduct.save();
    res.status(200).send(newProduct);
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).send({
        error: true,
        message: "Invalid product information",
      });
    }
    res.status(500).send({ error: true, message: error.message });
  }
};

//get-specific-product
exports.getSpecificProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Products.findOne({ _id: productId }).populate(
      "category"
    );

    if (!product) throw new Error("Product does not exist");

    res.status(200).send(product);
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

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

//search-product
exports.searchProducts = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const regex = new RegExp(searchTerm, "i");
    const products = await Products.find({ name: regex });

    res.status(200).send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

//update-product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const existingProduct = await Products.findOne({ _id: productId });

    if (!existingProduct) {
      return res
        .status(404)
        .send({ error: true, message: "Product not found" });
    }

    Object.assign(existingProduct, req.body);

    const updatedProduct = await existingProduct.save();

    res.status(200).send(updatedProduct);
  } catch (error) {
    if (
      error.name === "CastError" ||
      error.name === "ValidationError" ||
      error.name === "Error"
    ) {
      return res.status(400).send({
        error: true,
        message:
          error.name === "Error" || "ValidationError"
            ? error.message
            : "Invalid ProductId",
      });
    }

    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedDocument = await Products.findOneAndDelete({ _id: productId });
    if (!deletedDocument) {
      throw new Error("Product does not exist");
    }
    res.status(200).send(deletedDocument);
  } catch (error) {
    if (error.name === "CastError" || error.name === "Error") {
      return res.status(401).send({
        error: true,
        message: error.name === "Error" ? error.message : "Invalid product ID",
      });
    }
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};
