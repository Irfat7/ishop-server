const Products = require("../models/Products");

exports.checkProductIdExists = async (productId) => {
  const product = await Products.findById(productId);
  return product;
};
