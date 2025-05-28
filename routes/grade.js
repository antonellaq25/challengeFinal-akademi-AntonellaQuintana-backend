const express = require("express");
const router = express.Router();
const {
  createGrade,
  getGradesByStudent,
  getGradesByCourse,
  updateGrade,
  deleteGrade,
} = require("../controllers/grade-controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.use(authMiddleware);

router.post("/", roleMiddleware(["profesor"]), createGrade);
router.get("/student", roleMiddleware(["alumno"]), getGradesByStudent);
router.get("/course/:courseId", roleMiddleware(["profesor"]), getGradesByCourse);
router.put("/:id", roleMiddleware(["profesor"]), updateGrade);
router.delete("/:id", roleMiddleware(["profesor", "superadmin"]), deleteGrade);

module.exports = router;
