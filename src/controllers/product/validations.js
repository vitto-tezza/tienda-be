const Joi = require("joi");

const ProductSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  photos: Joi.array().items(Joi.string()).required(),
});

module.exports = ProductSchema;
