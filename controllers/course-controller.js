const Course = require("../models/Course");

exports.getCourses = async (req, res) => {
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
    res
      .status(500)
      .json({ message: "Error fetching courses", error: err.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching course", error: err.message });
  }
};
exports.getMyCourses = async (req, res) => {
  try {
    const teacherId = req.user.id; 
    const myCourses = await Course.find({ teacherId });

    res.status(200).json(myCourses);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching your courses",
      error: error.message,
    });
  }
};

exports.createCourse = async (req, res) => {
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
    res
      .status(400)
      .json({ message: "Error creating course", error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (
      course.teacherId.toString() !== req.user._id.toString() &&
      req.user.role !== "superadmin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this course" });
    }

    const { title, description, category, price, maxStudents, active } =
      req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (price !== undefined) course.price = price;
    if (maxStudents !== undefined) course.maxStudents = maxStudents;
    if (active !== undefined) course.active = active;

    await course.save();
    res.json({ message: "Course updated", course });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating course", error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await course.deleteOne();
    res.json({ message: "Course deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting course", error: err.message });
  }
};
