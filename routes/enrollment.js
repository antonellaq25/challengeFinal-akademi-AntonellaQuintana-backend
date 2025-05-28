const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollment-controller");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.use(authMiddleware);

router.get("/student", roleMiddleware(["student"]), enrollmentController.getEnrollmentsByStudent);
router.post("/", roleMiddleware(["student"]), enrollmentController.createEnrollment);
router.delete("/:id", roleMiddleware(["student"]), enrollmentController.deleteEnrollment);


router.get("/course/:courseId", roleMiddleware(["teacher"]), enrollmentController.getEnrollmentsByCourse);

module.exports = router;
