-- Synthetic demo data only. Insert order matters: ids are auto-generated from 1.
INSERT INTO mentor (name, department, max_teams) VALUES ('Dr. Meena K', 'CSE', 2), ('Dr. Arun S', 'IT', 3), ('Prof. Lakshmi R', 'AI&DS', 2);
INSERT INTO project (title, description, domain, required_skills, status, mentor_id) VALUES
 ('Smart Attendance System', 'Face-recognition based attendance for classrooms.', 'AI', 'Python,OpenCV', 'OPEN', 1),
 ('Campus Helpdesk Portal', 'Ticketing portal for campus maintenance requests.', 'Web', 'React,Spring Boot', 'ACTIVE', 2),
 ('Crop Disease Detector', 'Detect crop diseases from leaf images.', 'AI', 'Python,TensorFlow', 'OPEN', 1),
 ('Event Registration App', 'Register and manage club events.', 'Web', 'React,Java,MySQL', 'OPEN', NULL);
INSERT INTO team (name, max_size, project_id) VALUES ('Team Alpha', 4, 1), ('Team Beta', 4, 2), ('Team Gamma', 3, NULL);
INSERT INTO student (name, email, skills, team_id) VALUES
 ('Asha N', 'asha@example.edu', 'Python,OpenCV', 1), ('Bala R', 'bala@example.edu', 'Python,SQL', 1),
 ('Charan M', 'charan@example.edu', 'React,CSS', 2), ('Divya S', 'divya@example.edu', 'Java,Spring Boot', 2),
 ('Elan K', 'elan@example.edu', 'TensorFlow,Python', 3), ('Fathima A', 'fathima@example.edu', 'React,Java', NULL),
 ('Girish P', 'girish@example.edu', 'Python,TensorFlow', NULL), ('Harini V', 'harini@example.edu', 'MySQL,Java', NULL);
INSERT INTO milestone (title, due_date, status, project_id) VALUES
 ('Proposal approved', '2026-11-20', 'COMPLETED', 2), ('Wireframes', '2026-11-27', 'IN_PROGRESS', 2), ('Backend API', '2026-12-05', 'PENDING', 2),
 ('Dataset collection', '2026-11-25', 'IN_PROGRESS', 1), ('Model training', '2026-12-10', 'PENDING', 1);
