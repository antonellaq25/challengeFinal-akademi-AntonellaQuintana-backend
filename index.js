const express = require('express');
const app = express();
const connectDB = require('./config/db');
const dotenv = require('dotenv'); 
const cors = require('cors')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const courseRoutes = require('./routes/course')
const enrollmentRoutes = require('./routes/enrollment')
const gradeRoutes = require('./routes/grade')
dotenv.config();
connectDB();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/grades", gradeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
