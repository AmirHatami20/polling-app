require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("node:path");

const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");

const app = express();

app.use(cors({
    origin: 'https://polling-app-frontend-u5w9.onrender.com',
    credentials: true,
    method: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use('/uploads', express.static(path.join(__dirname, "/uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes)
app.use("/poll", pollRoutes)

  const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
})


