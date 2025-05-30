const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await User.countDocuments({});
    const users = await User.find({}).skip(skip).limit(parseInt(limit));

    if (!users) {
      throw { status: 404, message: "Users not found" };
    }
    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      results: users,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsersByFilter = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, name, email, role } = req.query;

    const filter = {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (email) filter.email = { $regex: email, $options: "i" };
    if (role) filter.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter, "-password")
      .skip(skip)
      .limit(parseInt(limit));

    if (!users) {
      throw { status: 404, message: "Users not found" };
    }

    res.json({
      users,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) throw { status: 404, message: "User not found" };
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  const { name, email, role, password } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) throw { status: 404, message: "User not found" };

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: "User successfully updated" });
  } catch (error) {
    next(error);
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw { status: 404, message: "User not found" };

    const token = generateToken(user._id, user.role);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; 
    await user.save();

    const link = `http://localhost:5173/reset-password/${token}`;
    await sendEmail(
      email,
      "Reset password",
      `Token to reset password: ${link}`
    );

    res.json({ message: "Email sent" });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) throw { status: 400, message: "Invalid or expired token" };

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: "Password has been reset" });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) throw { status: 404, message: "User not found" };
    res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
};

exports.getUserStats = async (req, res, next) => {
  try {
    const total = await User.countDocuments();

    const roles = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const monthly = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ total, roles, monthly });
  } catch (error) {
    next(error);
  }
};
