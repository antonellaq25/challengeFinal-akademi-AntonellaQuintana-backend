const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const authController = require("../controllers/auth-controller")
const {
  validateCreateUser,
  validateUpdateUser,
  validateRequestReset,
  validateResetPassword
} = require("../validations/userValidations");

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

router.post("/forgot-password", validateRequestReset,userController.requestPasswordReset);
router.post("/reset-password/:token",validateResetPassword, userController.resetPassword);

router.use(auth);
router.use(role(["superadmin"]));

router.post("/new",validateCreateUser, authController.register);
router.get("/", userController.getUsers);
router.get('/stats', userController.getUserStats);
router.get("/:id", userController.getUserById);
router.put("/:id", validateUpdateUser,userController.updateUser);
router.delete("/:id",userController.deleteUser);


module.exports = router;