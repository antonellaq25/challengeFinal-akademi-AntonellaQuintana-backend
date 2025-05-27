const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "teacher", "student"], required: true },
    active: { type: Boolean, default: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    //teachers
    subject: { type: String },

    //students
    dni: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
