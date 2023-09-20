"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
const router = _express2.default.Router();

var _product = require('../controllers/product'); var _product2 = _interopRequireDefault(_product);

var _grantAccess = require('../middlewares/grantAccess'); var _grantAccess2 = _interopRequireDefault(_grantAccess);
var _jwt = require('../helpers/jwt');

router.post(
  "/",
  _jwt.verifyAccessToken,
  _grantAccess2.default.call(void 0, "createAny", "product"),
  _product2.default.Create
);
router.get("/:product_id", _product2.default.Get);
router.get("/", _product2.default.GetList);
router.put("/:product_id", _product2.default.Update);
router.delete("/:product_id", _product2.default.Delete);

exports. default = router;
