const { Router } = require('express');

// Helpers
const { verifyAccessToken } = require('../helpers/jwt');

// Rutas
const auth = require('./auth');
const product = require('./product');
const order = require('./order');

const router = Router();

router.get('/', (req, res) => {
  res.end('¡Hola!');
});

router.use('/auth', auth);
router.use('/product', product);
router.use('/order', verifyAccessToken, order);

module.exports = router;
