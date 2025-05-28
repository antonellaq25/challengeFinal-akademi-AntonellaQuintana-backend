const express = require("express");
const router = express.Router();
const {
  createGrade,
  getGradesByStudent,
  getGradesByStudentId,
  getGradesByCourse,
  updateGrade,
  deleteGrade,
} = require("../controllers/grade-controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.use(authMiddleware);

router.post("/", roleMiddleware(["teacher"]), createGrade);
router.get("/student", roleMiddleware(["student"]), getGradesByStudent);
router.get("/student/:studentId", roleMiddleware(["teacher"]), getGradesByStudentId);
router.get("/course/:courseId", roleMiddleware(["teacher"]), getGradesByCourse);
router.put("/:id", roleMiddleware(["teacher"]), updateGrade);
router.delete("/:id", roleMiddleware(["teacher", "superadmin"]), deleteGrade);

module.exports = router;
