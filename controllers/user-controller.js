const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error getting users" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error searching user" });
  }
};

exports.updateUser = async (req, res) => {
  const { name, email, role, password } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: "User successfully updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = generateToken(user._id, user.role);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; 
    await user.save();

    const link = `http://localhost:5173/reset-password/${token}`;
    await sendEmail(email, "Reset password", `Token to reset password: ${link}`);

    res.json({ message: "Email sent" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid Token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ message: "Error at changing password" });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser= await User.findByIdAndDelete(req.params.id);
    if(!deletedUser) return res.status(404).json({ message: 'Could not find user' });
    res.status(200).json(deletedUser);

  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
};