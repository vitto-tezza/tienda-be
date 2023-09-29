const Product = require("../../models/product");
const Boom = require("boom");
const ProductSchema = require("./validations");

const Create = async (req, res, next) => {
  const input = req.body;

  try {
    input.photos = JSON.parse(input.photos);

    let product = new Product(input);

    if (input.stock && typeof input.stock === 'number' && input.stock >= 0) {
      product.stock = input.stock;
    }

    const savedData = await product.save();

    res.json(savedData);
  } catch (e) {
    next(e);
  }
};




const Get = async (req, res, next) => {
  const { product_id } = req.params;

  if (!product_id) {
    return next(Boom.badRequest("Missing parameter (:product_id)"));
  }

  try {
    const product = await Product.findById(product_id);

    res.json(product);
  } catch (e) {
    next(e);
  }
};

const Update = async (req, res, next) => {
  const { product_id } = req.params;

  try {
    const updated = await Product.findByIdAndUpdate(product_id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (e) {
    next(e);
  }
};

const Delete = async (req, res, next) => {
  const { product_id } = req.params;

  try {
    const deleted = await Product.findByIdAndDelete(product_id);

    if (!deleted) {
      throw Boom.badRequest("Product not found.");
    }

    res.json(deleted);
  } catch (e) {
    next(e);
  }
};

const limit = 12;
const GetList = async (req, res, next) => {
  let { page } = req.query;

  if (page < 1) {
    page = 1;
  }

  const skip = (parseInt(page) - 1) * limit;

  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(products);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  Create,
  Get,
  Update,
  Delete,
  GetList,
};
