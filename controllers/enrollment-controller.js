const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

exports.getEnrollmentsByStudent = async (req, res) => {
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
    res.status(500).json({ message: "Error fetching enrollments", error: err.message });
  }
};

exports.createEnrollment = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
  
    if (course.teacherId.toString() === studentId) {
      return res.status(403).json({ message: "Teachers cannot enroll in their own courses" });
    }

    const alreadyEnrolled = await Enrollment.findOne({ studentId, courseId });
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    const enrollmentCount = await Enrollment.countDocuments({ courseId });
    if (enrollmentCount >= course.maxStudents) {
      return res.status(400).json({ message: "Course is full" });
    }

    const enrollment = new Enrollment({ studentId, courseId });
    await enrollment.save();

    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: "Error creating enrollment", error: err.message });
  }
};

exports.deleteEnrollment = async (req, res) => {
  try {
    const studentId = req.user.id;
    const enrollmentId = req.params.id;

    const enrollment = await Enrollment.findOne({ _id: enrollmentId, studentId });
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found or access denied" });

    await enrollment.deleteOne();

    res.json({ message: "Enrollment cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling enrollment", error: err.message });
  }
};

exports.getEnrollmentsByCourse = async (req, res) => {
  try {
    const professorId = req.user.id;
    const courseId = req.params.courseId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const course = await Course.findOne({ _id: courseId, teacherId: professorId });
    if (!course) return res.status(403).json({ message: "Access denied or course not found" });

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
    res.status(500).json({ message: "Error fetching enrollments", error: err.message });
  }
};
