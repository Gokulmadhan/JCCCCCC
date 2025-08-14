const express = require("express");
const UserController = require("../controllers/userController");
const router = express.Router();

// Public routes
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
// Protected routes (you can add middleware for auth)
router.get("/", UserController.getAllUsers);
router.get("/:user_id", UserController.getUserById);
router.put("/:user_id", UserController.updateUser);
router.delete("/:user_id", UserController.deleteUser);

//cart items

router.get("/cart/:user_id",UserController.getCartById);
router.post("/cart/:user_id", UserController.addToCart);
router.patch("/cart/:user_id",UserController.updateCart);
router.delete('/cart/:user_id/:item_id',UserController.deleteItem);
router.delete('/cart/:cart_id',UserController.discardCart)


module.exports = router;
