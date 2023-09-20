const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth");
const { verifyAccessToken } = require("../helpers/jwt");

router.post("/register", auth.Register);
router.post("/login", auth.Login);
router.post("/refresh_token", auth.RefreshToken);
router.post("/logout", auth.Logout);
router.get("/me", verifyAccessToken, auth.Me);
router.get("/users", auth.GetAllUsers);
router.delete("/admin/users/:userId", verifyAccessToken, auth.deleteUser);
router.put("/admin/users/:userId/role", verifyAccessToken, auth.changeUserRole);

module.exports = router;
