const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course-controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.use(authMiddleware);

router.get("/", roleMiddleware(["student", "superadmin"]), getCourses);
router.get("/:id", getCourseById);
router.post("/", roleMiddleware(["teacher"]), createCourse);
router.put("/:id", roleMiddleware(["teacher", "superadmin"]), updateCourse);
router.delete("/:id", roleMiddleware(["teacher", "superadmin"]), deleteCourse);

module.exports = router;
