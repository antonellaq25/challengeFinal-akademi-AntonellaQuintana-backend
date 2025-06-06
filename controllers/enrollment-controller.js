const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

exports.getEnrollmentsByStudent = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Enrollment.countDocuments({ student: studentId });
    const enrollments = await Enrollment.find({ student: studentId })
      .populate("course", "title category price")
      .skip(skip)
      .limit(limit);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      enrollments,
    });
  } catch (err) {
    console.error("Enrollment fetch error:", err);
    next({ statusCode: 500, message: "Error fetching enrollments", ...err });
  }
};

exports.createEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }

    const alreadyEnrolled = await Enrollment.findOne({ course: courseId, student: studentId });
    if (alreadyEnrolled) {
      const error = new Error("User already enrolled in this course");
      error.status = 400;
      throw error;
    }
    const currentEnrollments = await Enrollment.countDocuments({ course: courseId });
    if (currentEnrollments >= course.maxStudents) {
      const error = new Error("Course is full. Maximum number of students reached.");
      error.status = 400;
      throw error;
    }

    const enrollment = new Enrollment({
      course: courseId,
      student: studentId,
    });

    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
};

exports.deleteEnrollment = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const enrollmentId = req.params.id;

    const enrollment = await Enrollment.findOne({ _id: enrollmentId, student: studentId });
    if (!enrollment) throw { statusCode: 404, message: "Enrollment not found or access denied" };

    await enrollment.deleteOne();
    res.json({ message: "Enrollment cancelled" });
  } catch (err) {
    next({ statusCode: 500, message: "Error cancelling enrollment", ...err });
  }
};

exports.getEnrollmentsByCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const course = await Course.findById(courseId);
    if (!course) {
      throw { statusCode: 404, message: "Course not found" };
    }

    if ((course.teacherId.toString() !== req.user.id) && req.user.role !== "superadmin") {
      throw { statusCode: 403, message: "Access denied: You are not the owner of this course" };
    }
    const total = await Enrollment.countDocuments({ course: courseId });
    const enrollments = await Enrollment.find({ course: courseId })
      .populate("student", "name email")
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
