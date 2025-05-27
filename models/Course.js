const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    maxStudents: { type: Number, required: true },
    teacherId: { type: Types.ObjectId, ref: "User", required: true }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);