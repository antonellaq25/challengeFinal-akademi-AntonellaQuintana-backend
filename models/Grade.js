const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const gradeSchema = new Schema(
  {
    studentId: { type: Types.ObjectId, ref: "User", required: true},
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    feedback: { type: String },
    gradedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

gradeSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("Grade", gradeSchema);
