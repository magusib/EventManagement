-- Sample seed data for EventManagement
USE `sports_db`;

-- Sample clubs
INSERT INTO `clubs` (`name`, `description`, `achievements`, `coach`, `current_members`, `training_schedule`) VALUES
('Basketball Club', 'Competitive basketball team', 'Regional champs 2023', 'Coach Santos', 20, 'Mon/Wed/Fri 5:00PM'),
('Volleyball Club', 'Recreational volleyball club', 'City league winners 2022', 'Coach Reyes', 18, 'Tue/Thu 4:00PM');

-- Sample events
INSERT INTO `events` (`title`, `description`, `venue`, `event_date`, `start_time`) VALUES
('Inter-school Tournament', 'A friendly tournament between schools', 'Main Gym', '2025-12-05', '09:00:00'),
('Sports Fest Opening', 'Opening ceremony for the sports fest', 'College Grounds', '2025-11-25', '08:30:00');

-- Sample activities registration
INSERT INTO `activities_registration` (`registration_type`, `name`, `email`, `school_id`, `activity_option`, `status`) VALUES
('Individual','Juan Dela Cruz','juan@example.com','STU-001','100m Dash','Pending');

-- Announcements (leave posted_by NULL or update after creating an admin)
INSERT INTO `announcements` (`title`, `message`, `posted_by`) VALUES
('Welcome','Welcome to the Sports Management Portal', NULL);

-- Optional: create an admin user
-- Replace <BCRYPT_HASH_HERE> with a bcrypt hash of your desired password.
-- You can generate a hash using node (from project root) after installing dependencies:
-- node -e "console.log(require('bcryptjs').hashSync('yourAdminPassword', 10))"
-- Example insert (replace hash and email as needed):
-- INSERT INTO `users` (`fullname`,`email`,`phone`,`password`,`role`) VALUES ('Admin User','admin@paterostechnologicalcollege.edu.ph','09170000000','<BCRYPT_HASH_HERE>','admin');
