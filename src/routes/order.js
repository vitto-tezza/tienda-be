const express = require('express');
const router = express.Router();

const Order = require('../controllers/order');

router.post('/', Order.Create);
router.get('/', Order.List);
router.get('/my-orders', Order.GetMyOrders);

module.exports = router;
