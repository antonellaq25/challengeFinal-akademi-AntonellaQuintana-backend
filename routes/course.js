const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course-controller");
const {
  validateCreateCourse,
  validateUpdateCourse,
} = require("../validations/couseValidations");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.use(authMiddleware);

router.get("/", roleMiddleware(["student", "superadmin"]), courseController.getCourses);
router.get("/my-courses", roleMiddleware(["teacher"]), courseController.getMyCourses);
router.get("/:id", courseController.getCourseById);
router.post("/", roleMiddleware(["teacher"]), validateCreateCourse,courseController.createCourse);
router.put("/:id", roleMiddleware(["teacher", "superadmin"]),validateUpdateCourse, courseController.updateCourse);
router.delete("/:id", roleMiddleware(["teacher", "superadmin"]), courseController.deleteCourse);

module.exports = router;
