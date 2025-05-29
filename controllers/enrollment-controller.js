const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

exports.getEnrollmentsByStudent = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Enrollment.countDocuments({ studentId });
    const enrollments = await Enrollment.find({ studentId })
      .populate("courseId", "title category price")
      .skip(skip)
      .limit(limit);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      enrollments,
    });
  } catch (err) {
    next({ statusCode: 500, message: "Error fetching enrollments", ...err });
  }
};

exports.createEnrollment = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) throw { statusCode: 404, message: "Course not found" };

    if (course.teacherId.toString() === studentId) {
      throw { statusCode: 403, message: "Teachers cannot enroll in their own courses" };
    }

    const alreadyEnrolled = await Enrollment.findOne({ studentId, courseId });
    if (alreadyEnrolled) {
      throw { statusCode: 400, message: "Already enrolled in this course" };
    }

    const enrollmentCount = await Enrollment.countDocuments({ courseId });
    if (enrollmentCount >= course.maxStudents) {
      throw { statusCode: 400, message: "Course is full" };
    }

    const enrollment = new Enrollment({ studentId, courseId });
    await enrollment.save();

    res.status(201).json(enrollment);
  } catch (err) {
    next({ statusCode: err.statusCode || 500, message: err.message || "Error creating enrollment" });
  }
};

exports.deleteEnrollment = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const enrollmentId = req.params.id;

    const enrollment = await Enrollment.findOne({ _id: enrollmentId, studentId });
    if (!enrollment) throw { statusCode: 404, message: "Enrollment not found or access denied" };

    await enrollment.deleteOne();
    res.json({ message: "Enrollment cancelled" });
  } catch (err) {
    next({ statusCode: 500, message: "Error cancelling enrollment", ...err });
  }
};

exports.getEnrollmentsByCourse = async (req, res, next) => {
  try {
    const professorId = req.user.id;
    const courseId = req.params.courseId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const course = await Course.findOne({ _id: courseId, teacherId: professorId });
    if (!course) throw { statusCode: 403, message: "Access denied or course not found" };

    const total = await Enrollment.countDocuments({ courseId });
    const enrollments = await Enrollment.find({ courseId })
      .populate("studentId", "name email")
      .skip(skip)
      .limit(limit);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      enrollments,
    });
  } catch (err) {
    next({ statusCode: 500, message: "Error fetching enrollments", ...err });
  }
};
