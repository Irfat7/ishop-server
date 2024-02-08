const Products = require("../models/Products");

exports.checkProductIdExists = async (productId) => {
  const product = await Products.findById(productId);
  return product;
};

/* exports.checkProductAvailable = async (productId) => {
  const product = await Products.findById(productId);
  return product !== null;
}; */
