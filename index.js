const express = require('express');
const app = express();
const connectDB = require('./config/db');
const dotenv = require('dotenv'); 
const cors = require('cors')
dotenv.config();
connectDB();

app.use(express.json());


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
