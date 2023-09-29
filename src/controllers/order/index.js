const User = require("../../models/user");
const Order = require("../../models/order");
const Product = require("../../models/product");
const Boom = require("boom");
const OrderSchema = require("./validations");

const Create = async (req, res, next) => {
  const input = req.body;
  input.items = input.items ? JSON.parse(input.items) : null;
  const { error } = OrderSchema.validate(input);

  if (error) {
    return next(Boom.badRequest(error.details[0].message));
  }

  const { user_id } = req.payload;

  try {
    const orderItems = input.items; 

    const productsInOrder = await Product.find({ _id: { $in: orderItems } });

    let hasStockError = false;

    for (const product of productsInOrder) {
      if (product.stock > 0) {

        product.stock -= 1;

        await product.save();
      } else {
        hasStockError = true;
      }
    }

    if (hasStockError) {
      return res.status(400).json({ message: 'Algunos productos no tienen suficiente stock.' });
    }

    const order = new Order({
      user: user_id,
      address: input.address,
      items: input.items,
    });

    const savedData = await order.save();

    res.json(savedData);
  } catch (e) {
    next(e);
  }
};


const List = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("user", "-password -__v")
      .populate({
        path: "items",
        model: "product",
        select: "name",
      })
      .select("user address items");

    res.json(orders);
  } catch (e) {
    next(e);
  }
};

const GetMyOrders = async (req, res, next) => {
  const { user_id } = req.payload;

  try {
    const orders = await Order.find({ user: user_id }).populate("items");

    res.json(orders);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  Create,
  List,
  GetMyOrders,
};
