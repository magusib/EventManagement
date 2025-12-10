const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ debug: false });

const authRoutes = require("../routes/auth");
const clubRoutes = require("../routes/club");
const eventRoutes = require("../routes/event");
const announcementRoutes = require("../routes/announcement");
const profileRoutes = require("../routes/profile");
const registrationRoutes = require("../routes/registration");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UPLOAD_DIR = process.env.UPLOAD_DIR || "../uploads";
app.use("/uploads", express.static(path.join(__dirname, UPLOAD_DIR)));

app.use("/api", authRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/registrations", registrationRoutes);

module.exports = app;
