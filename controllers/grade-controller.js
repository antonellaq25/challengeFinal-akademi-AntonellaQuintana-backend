const Grade = require("../models/Grade");
const Course = require("../models/Course");

exports.createGrade = async (req, res, next) => {
  try {
    const { studentId, courseId, score, feedback } = req.body;

    const course = await Course.findById(courseId);
    if (!course) throw new Error("Course not found");

    if (course.teacherId.toString() !== req.user.id.toString()) {
      const err = new Error("Not authorized to grade this course");
      err.statusCode = 403;
      throw err;
    }

    const grade = await Grade.create({ studentId, courseId, score, feedback });
    res.status(201).json(grade);
  } catch (err) {
    next(err);
  }
};

exports.getGradesByStudent = async (req, res, next) => {
  try {
    const grades = await Grade.find({ studentId: req.user.id }).populate("courseId", "title category");
    res.json(grades);
  } catch (err) {
    next(err);
  }
};

exports.getGradesByStudentId = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const teacherId = req.user.id;

    const courses = await Course.find({ teacherId }).select("_id");
    const courseIds = courses.map(course => course._id);

    const grades = await Grade.find({
      studentId,
      courseId: { $in: courseIds },
    }).populate("courseId", "title category");

    res.json(grades);
  } catch (err) {
    next(err);
  }
};

exports.getGradesByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) throw new Error("Course not found");

    if (course.teacherId.toString() !== req.user.id.toString()) {
      const err = new Error("Not authorized to view grades for this course");
      err.statusCode = 403;
      throw err;
    }

    const grades = await Grade.find({ courseId }).populate("studentId", "name email");
    res.json(grades);
  } catch (err) {
    next(err);
  }
};

exports.updateGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { score, feedback } = req.body;

    const grade = await Grade.findById(id).populate("courseId");
    if (!grade) throw new Error("Grade not found");

    if (grade.courseId.teacherId.toString() !== req.user._id.toString()) {
      const err = new Error("Not authorized to update this grade");
      err.statusCode = 403;
      throw err;
    }

    grade.score = score ?? grade.score;
    grade.feedback = feedback ?? grade.feedback;
    grade.gradedAt = new Date();

    await grade.save();
    res.json(grade);
  } catch (err) {
    next(err);
  }
};

exports.deleteGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const grade = await Grade.findById(id).populate("courseId");

    if (!grade) throw new Error("Grade not found");

    const isOwner = grade.courseId.teacherId.toString() === req.user._id.toString();
    const isSuperadmin = req.user.role === "superadmin";

    if (!isOwner && !isSuperadmin) {
      const err = new Error("Not authorized to delete this grade");
      err.statusCode = 403;
      throw err;
    }

    await grade.deleteOne();
    res.json({ message: "Grade deleted successfully" });
  } catch (err) {
    next(err);
  }
};
