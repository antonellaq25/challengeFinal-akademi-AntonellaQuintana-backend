const express = require("express");
const router = express.Router();
const studentMiddleware = require('../middlewares/studentMiddleware')
const { register, login } = require("../controllers/auth-controller");

router.post("/register", studentMiddleware(), register);
router.post("/login", login);

module.exports = router;
