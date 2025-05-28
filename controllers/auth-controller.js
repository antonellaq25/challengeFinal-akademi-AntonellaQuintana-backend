const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User successfully created",
      user: {
        id: newUser._id,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error); 
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.active) {
      const error = new Error("Invalid credentials");
      error.status = 401;
      throw error;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const error = new Error("Invalid credentials");
      error.status = 401;
      throw error;
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error); 
  }
};
