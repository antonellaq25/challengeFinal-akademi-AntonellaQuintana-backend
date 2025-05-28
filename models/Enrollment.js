const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const enrollmentSchema = new Schema(
  {
    studentId: { type: Types.ObjectId, ref: "User", required: true },
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
