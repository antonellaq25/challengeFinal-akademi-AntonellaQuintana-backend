const express = require("express");
const router = express.Router();
const gradeController = require("../controllers/grade-controller");
const {validateCreateGrade,
  validateUpdateGrade} =require("../validations/gradeValidations")

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.use(authMiddleware);

router.post("/", roleMiddleware(["teacher"]),validateCreateGrade,gradeController.createGrade);
router.get("/student", roleMiddleware(["student"]), gradeController.getGradesByStudent);
router.get("/student/:studentId", roleMiddleware(["teacher"]), gradeController.getGradesByStudentId);
router.get("/course/:courseId", roleMiddleware(["teacher"]), gradeController.getGradesByCourse);
router.put("/:id", roleMiddleware(["teacher"]),validateUpdateGrade, gradeController.updateGrade);
router.delete("/:id", roleMiddleware(["teacher", "superadmin"]), gradeController.deleteGrade);

module.exports = router;
