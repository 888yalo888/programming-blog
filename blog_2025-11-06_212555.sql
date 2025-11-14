-- Seed data for programming blog
-- Run this AFTER creating the schema

-- Insert roles
INSERT INTO roles (id, role, created_at) VALUES
(1, 'user', '2025-04-16 03:32:23.059072'),
(2, 'admin', '2025-03-27 16:01:40.787521');

-- Reset role sequence
SELECT pg_catalog.setval('roles_id_seq', 2, true);

-- Insert users
INSERT INTO users (id, email, name, photo, modified_at, created_at, google_id) VALUES
(18, 'olgaorlova241@gmail.com', 'Olga Orlova', 'https://lh3.googleusercontent.com/a/ACg8ocJc_r4qikgCXW-QN_W_IX4-fssWPUeoR5cBzm2XdyVezJVX=s96-c', NULL, '2025-02-21 02:49:16.096321', 'DUMMY_OAUTH_TOKEN_FOR_TESTING'),
(28, '888yalosinger@gmail.com', 'Ольга Орлова', 'https://lh3.googleusercontent.com/a/ACg8ocKLdHTMoBR_dU3-ZPPmlloblIonmIJcXryCN9r0X73dbhsw4w=s96-c', NULL, '2025-04-16 16:52:53.768804', 'DUMMY_OAUTH_TOKEN_FOR_TESTING');

-- Reset users sequence
SELECT pg_catalog.setval('users_id_seq', 28, true);

-- Insert user roles
INSERT INTO user_roles (id, role_id, user_id, assigned_at) VALUES
(4, 1, 28, '2025-04-16 16:52:53.850772'),
(5, 2, 18, '2025-04-24 02:55:23.649394');

-- Reset user_roles sequence
SELECT pg_catalog.setval('user_roles_id_seq', 5, true);

-- Insert tokens (Note: these tokens are likely expired)
INSERT INTO tokens (access_token, profile_id, refresh_token) VALUES
('DUMMY_OAUTH_TOKEN_FOR_TESTING', NULL);

-- Reset tokens sequence
SELECT pg_catalog.setval('tokens_id_seq', 19, true);

-- Insert articles
INSERT INTO articles (id, title, text, comments_count, is_published, updated_at, likes_count, created_at) VALUES
(8, 'Port', 'Ports are ligical connections that are used by programms and services to exchange information...', 0, true, NULL, 0, '2024-11-26 03:57:02.012269'),
(9, 'Rest API', 'Rest API is an architectural approach not a technology. It''s a type of communication between client-server...', 0, true, NULL, 0, '2024-11-27 02:53:06.941736'),
(11, 'React hook useRef', 'Ref is like a state but except ref doesn''t rerender a component...', 0, true, NULL, 0, '2024-11-28 01:59:58.326678'),
(12, 'Docker', 'Docker is a service for launching apps in conteiners...', 0, false, NULL, 0, '2024-11-28 02:04:04.956954'),
(20, 'Namespace', '# Namespace might  look like an object except it\''s declared with the key word "namespace"\.\.\.', 0, true, NULL, 0, '2024-12-05 03:41:45.753839'),
(21, 'What Is Apache Web Server?', '# Apache is a popular open\-source\, cross\-platform web server that is\, by the numbers\, the most popular web server in existence\. It''s actively maintained by the Apache Software Foundation\.', 0, true, NULL, 0, '2024-12-05 03:44:36.595175'),
(22, 'PostreSQL database relationships', '# There are 3 types of table relationships in a relational database\. The relationships can be enforced by defining the right foreign key constraints on the columns\.\.\.', 0, true, NULL, 0, '2024-12-05 03:51:03.407347'),
(23, 'What is ACID?', '# ACID stands for Atomicity\, consistency\, isolation and durability\.\.\.', 0, true, NULL, 0, '2024-12-05 03:55:15.045294'),
(24, 'Linear Interpolation Formula', '# Linear Interpolation Formula is a method that constructs the new data points from the given set of data points\.', 0, true, NULL, 0, '2024-12-05 03:57:34.644051'),
(25, 'Intl JavaScript class', '# Intl in JavaScript is an object which is used for ECMAScript Internationalization API namespace\.\.\.', 0, true, NULL, 0, '2024-12-05 04:00:27.580549'),
(26, 'SQL injection', '# In computing\, SQL injection is a code injection technique used to attack data\-driven applications\, in which malicious SQL statements are inserted into an entry field for execution\.\.\.', 0, true, NULL, 0, '2024-12-05 04:29:46.601533'),
(28, 'Pure functions and functions with side effects', '# Pure functions are functions that always outputs the same results with the same arguments no matter how many times it\''s called \.\.\.', 0, true, NULL, 0, '2024-12-05 04:31:47.321098'),
(29, 'SMTP', '# The Simple Mail Transfer Protocol is an Internet standard communication protocol for electronic mail transmission\. Mail servers and other message transfer agents use SMTP to send and receive mail messages\.', 0, true, NULL, 0, '2024-12-05 04:34:13.849658'),
(31, 'Express middlewares', 'Middleware is just a function that is to be invoked in the middle of two main functionalities', 0, true, NULL, 0, '2025-03-10 03:28:12.012545'),
(34, 'Math.random()', 'Math.random * number(9) = [0-9]...', 0, true, NULL, 0, '2025-05-02 01:55:56.087395');

-- Reset articles sequence
SELECT pg_catalog.setval('articles_id_seq', 35, true);

-- Insert comments
INSERT INTO comments_info (id, user_id, article_id, comment, updated_at, created_at, comment_reply_id) VALUES
(27, 18, 31, 'Very nice article. Thank you', NULL, '2025-03-28 16:05:39.992582', NULL),
(28, 18, 31, 'Very nice article. Thank you', NULL, '2025-03-28 16:05:50.343426', NULL),
(29, 18, 9, 'very nice', NULL, '2025-09-03 02:33:23.140165', NULL),
(30, 18, 9, 'very nice', NULL, '2025-09-03 02:33:23.970601', NULL),
(31, 18, 9, 'very nice', NULL, '2025-09-03 02:33:57.217662', NULL),
(32, 18, 9, 'very nice', NULL, '2025-09-03 02:33:57.411767', NULL),
(33, 18, 9, 'very nice', NULL, '2025-09-03 02:33:57.566619', NULL),
(34, 18, 9, 'very nice', NULL, '2025-09-03 02:33:57.721895', NULL),
(35, 18, 9, 'very nice', NULL, '2025-09-03 02:33:57.871822', NULL),
(36, 18, 9, 'very nice', NULL, '2025-09-03 02:33:58.024856', NULL),
(37, 18, 8, 'very nice', NULL, '2025-09-03 02:45:10.47993', NULL),
(38, 18, 8, 'very nice', NULL, '2025-09-03 02:45:11.566452', NULL),
(39, 18, 8, 'not bad', NULL, '2025-09-03 03:06:46.475607', NULL),
(48, 28, 8, 'Would like to see more', NULL, '2025-10-17 03:38:07.544838', NULL);

-- Reset comments sequence
SELECT pg_catalog.setval('comments_info_id_seq', 48, true);

-- Note: No likes data to insert

-- Note: Session data omitted as it's temporary and contains active session info