const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const authController = require("../controllers/auth-controller")

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

router.post("/forgot-password", userController.requestPasswordReset);
router.post("/reset-password/:token", userController.resetPassword);

router.use(auth);
router.use(role(["superadmin"]));

router.post("/new", authController.register);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id",userController.deleteUser);

module.exports = router;