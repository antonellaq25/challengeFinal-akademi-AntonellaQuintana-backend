const Grade = require("../models/Grade");
const Course = require("../models/Course");

exports.createGrade = async (req, res) => {
  try {
    const { studentId, courseId, score, feedback } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.professorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to grade this course" });
    }

    const grade = await Grade.create({ studentId, courseId, score, feedback });
    res.status(201).json(grade);
  } catch (err) {
    res.status(500).json({ message: "Error creating grade", error: err.message });
  }
};

exports.getGradesByStudent = async (req, res) => {
  try {
    const grades = await Grade.find({ studentId: req.user._id }).populate("courseId", "title category");
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student grades", error: err.message });
  }
};

exports.getGradesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.professorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view grades for this course" });
    }

    const grades = await Grade.find({ courseId }).populate("studentId", "name email");
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: "Error fetching grades by course", error: err.message });
  }
};

exports.updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, feedback } = req.body;

    const grade = await Grade.findById(id).populate("courseId");
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    if (grade.courseId.professorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this grade" });
    }

    grade.score = score ?? grade.score;
    grade.feedback = feedback ?? grade.feedback;
    grade.gradedAt = new Date();

    await grade.save();
    res.json(grade);
  } catch (err) {
    res.status(500).json({ message: "Error updating grade", error: err.message });
  }
};

exports.deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const grade = await Grade.findById(id).populate("courseId");

    if (!grade) return res.status(404).json({ message: "Grade not found" });

    const isOwner = grade.courseId.professorId.toString() === req.user._id.toString();
    const isSuperadmin = req.user.role === "superadmin";

    if (!isOwner && !isSuperadmin) {
      return res.status(403).json({ message: "Not authorized to delete this grade" });
    }

    await grade.deleteOne();
    res.json({ message: "Grade deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting grade", error: err.message });
  }
};
