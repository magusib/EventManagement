// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Disable dotenv tips/logs
dotenv.config({ debug: false });

const authRoutes = require("./routes/auth");
const clubRoutes = require("./routes/club");
const clubRegRoutes = require("./routes/clubRegistration");
const activitiesRegRoutes = require("./routes/activitiesRegistration");
const eventRoutes = require("./routes/event");
const announcementRoutes = require("./routes/announcement");
const profileRoutes = require("./routes/profile");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
app.use("/uploads", express.static(path.join(__dirname, UPLOAD_DIR)));

// Routes
app.use("/api", authRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/club-registrations", clubRegRoutes);
app.use("/api/activity-registrations", activitiesRegRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/profile", profileRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
