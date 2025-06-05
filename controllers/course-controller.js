const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.getCourses = async (req, res, next) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Course.countDocuments({});
    const courses = await Course.find({})
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      results: courses,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses", error: err.message });
  }
};
exports.getCoursesByFilter = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, active, title } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (active !== undefined) filter.active = active === "true";
    if (title) filter.title = { $regex: title, $options: "i" };

    const total = await Course.countDocuments(filter);
    const courses = await Course.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ total, page: Number(page), courses });
  } catch (err) {
    next(err);
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }
    res.json(course);
  } catch (err) {
    next(err);
  }
};

exports.getMyCourses = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const myCourses = await Course.find({ teacherId });
    res.status(200).json(myCourses);
  } catch (error) {
    next(error);
  }
};

exports.createCourse = async (req, res, next) => {
  const { title, description, category, price, maxStudents } = req.body;
  try {
    const course = new Course({
      title,
      description,
      category,
      price,
      maxStudents,
      teacherId: req.user.id,
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }
    if (

      course.teacherId.toString() !== req.user.id.toString() &&
      req.user.role !== "superadmin"
    ) {
      const error = new Error("Not authorized to modify this course");
      error.status = 403;
      throw error;
    }

    const { title, description, category, price, maxStudents, active } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (price !== undefined) course.price = price;
    if (maxStudents !== undefined) course.maxStudents = maxStudents;
    if (active !== undefined) course.active = active;

    await course.save();
    res.json({ message: "Course updated", course });
  } catch (err) {
    next(err);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }

    const hasEnrollments = await Enrollment.exists({ course: course._id });
    if (hasEnrollments) {
      const error = new Error("Cannot delete course with enrolled students");
      error.status = 400;
      throw error;
    }

    await course.deleteOne();
    res.json({ message: "Course deleted" });
  } catch (err) {
    next(err);
  }
};
