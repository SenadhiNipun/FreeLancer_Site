/*
 Navicat Premium Dump SQL

 Source Server         : Assignment_system
 Source Server Type    : MySQL
 Source Server Version : 80044 (8.0.44)
 Source Host           : localhost:3306
 Source Schema         : assignment_system

 Target Server Type    : MySQL
 Target Server Version : 80044 (8.0.44)
 File Encoding         : 65001

 Date: 02/07/2026 21:57:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for academic_categories
-- ----------------------------
DROP TABLE IF EXISTS `academic_categories`;
CREATE TABLE `academic_categories`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `display_order` int NULL DEFAULT NULL,
  `is_active` tinyint(1) NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of academic_categories
-- ----------------------------
INSERT INTO `academic_categories` VALUES (1, 'Information Technology', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `academic_categories` VALUES (2, 'Business & Management', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `academic_categories` VALUES (3, 'Engineering', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `academic_categories` VALUES (4, 'Health & Medicine', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `academic_categories` VALUES (5, 'Social Sciences', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `academic_categories` VALUES (6, 'Arts & Humanities', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);

-- ----------------------------
-- Table structure for chat_message_attachments
-- ----------------------------
DROP TABLE IF EXISTS `chat_message_attachments`;
CREATE TABLE `chat_message_attachments`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `message_id` bigint NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mime_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `file_size` int NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `message_id`(`message_id` ASC) USING BTREE,
  CONSTRAINT `chat_message_attachments_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `chat_messages` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chat_message_attachments
-- ----------------------------
INSERT INTO `chat_message_attachments` VALUES (1, 73, 'Master Thesis Final - Yaggahavita Liyanage Malinda.docx', '/uploads/chats/20260518231642888274_Master_Thesis_Final_-_Yaggahavita_Liyanage_Malinda.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 836417, 0, '2026-05-18 23:16:45', '2026-05-18 23:16:45', NULL);

-- ----------------------------
-- Table structure for chat_messages
-- ----------------------------
DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE `chat_messages`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `session_id` bigint NOT NULL,
  `sender_id` bigint NOT NULL,
  `message_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `message_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'TEXT',
  `proposed_amount` decimal(10, 2) NULL DEFAULT NULL,
  `bid_change_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `session_id`(`session_id` ASC) USING BTREE,
  INDEX `sender_id`(`sender_id` ASC) USING BTREE,
  CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 96 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chat_messages
-- ----------------------------
INSERT INTO `chat_messages` VALUES (1, 2, 4, 'hi', 0, '2026-04-27 23:20:02', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (2, 2, 4, 'hello', 0, '2026-04-27 23:23:16', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (3, 2, 4, 'hi', 0, '2026-04-27 23:23:35', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (4, 2, 4, 'so?', 0, '2026-04-27 23:23:49', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (5, 2, 4, 'hi', 0, '2026-04-27 23:27:41', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (6, 2, 4, 'hi', 0, '2026-04-27 23:27:48', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (7, 2, 4, 'ji', 0, '2026-04-27 23:34:17', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (8, 2, 4, 'io', 0, '2026-04-27 23:41:45', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (9, 1, 6, 'hi', 0, '2026-04-27 23:42:52', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (10, 2, 4, 'hi', 0, '2026-04-27 23:43:46', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (11, 2, 4, 'sen', 0, '2026-04-27 23:43:51', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (12, 1, 6, 'hi', 0, '2026-04-27 23:44:01', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (13, 3, 4, 'kiyak da last kiyanne', 1, '2026-04-27 23:46:15', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (14, 3, 6, '50kta karamu', 1, '2026-04-27 23:46:35', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (15, 3, 4, 'iun', 1, '2026-04-27 23:47:30', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (16, 3, 6, 'hi', 1, '2026-04-27 23:51:41', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (17, 3, 4, 'hi', 1, '2026-04-27 23:51:53', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (18, 3, 6, 'mk', 1, '2026-04-27 23:52:12', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (19, 3, 4, 'mk?', 1, '2026-04-27 23:52:19', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (20, 3, 6, 'mn', 1, '2026-04-27 23:53:41', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (21, 3, 4, 'hi', 1, '2026-04-27 23:53:59', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (22, 3, 6, 'oo kiyapan', 1, '2026-04-27 23:54:19', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (23, 3, 4, 'ha', 1, '2026-04-27 23:54:34', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (24, 4, 4, 'hi', 1, '2026-04-27 23:59:26', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (25, 4, 6, 'hi hi', 1, '2026-04-27 23:59:53', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (26, 4, 4, 'hi notify', 1, '2026-04-28 00:10:12', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (27, 4, 4, 'hi bro', 1, '2026-04-28 00:10:29', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (28, 4, 6, 'hi hi', 1, '2026-04-28 00:17:34', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (29, 4, 6, 'hi', 1, '2026-04-28 00:20:29', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (30, 4, 6, 'hi', 1, '2026-04-28 00:20:42', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (31, 4, 4, 'hi', 1, '2026-04-28 00:21:06', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (32, 4, 4, 'hi', 1, '2026-04-28 00:21:18', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (33, 4, 6, 'hi', 1, '2026-04-28 00:21:47', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (34, 4, 6, 'hi', 1, '2026-04-28 00:21:51', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (35, 4, 6, 'hi', 1, '2026-04-28 00:21:58', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (36, 4, 6, 'hi', 1, '2026-04-28 00:25:37', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (37, 4, 6, 'ji', 1, '2026-04-28 00:25:44', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (38, 4, 6, 'ji', 1, '2026-04-28 00:25:48', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (39, 4, 6, 'ji', 1, '2026-04-28 00:26:09', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (40, 4, 6, 'ji', 1, '2026-04-28 00:26:14', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (41, 4, 6, 'ji', 1, '2026-04-28 00:26:18', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (42, 4, 6, 'hi hi hi', 1, '2026-04-28 00:28:19', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (43, 4, 6, 'hi', 1, '2026-04-28 00:28:22', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (44, 4, 6, 'k', 1, '2026-04-28 00:29:59', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (45, 5, 4, 'machn', 1, '2026-04-28 00:34:32', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (46, 5, 4, '100ta kramu', 1, '2026-04-28 00:34:37', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (47, 5, 6, 'pissuda huththo', 1, '2026-04-28 00:34:56', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (48, 5, 6, 'padui', 1, '2026-04-28 00:35:00', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (49, 6, 4, 'adu krnna berida?', 1, '2026-05-01 17:04:32', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (50, 6, 6, 'ba puluwan deyak krpan', 1, '2026-05-01 17:04:51', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (51, 6, 4, 'ha ha', 1, '2026-05-01 17:04:56', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (52, 7, 4, 'hi', 1, '2026-05-02 09:38:45', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (53, 7, 6, 'hi', 1, '2026-05-02 09:39:00', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (54, 8, 7, 'adu krnna berida', 1, '2026-05-02 22:21:20', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (55, 8, 7, 'reply krapamko', 1, '2026-05-02 22:22:54', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (56, 8, 8, 'kytda', 1, '2026-05-02 22:26:49', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (57, 8, 7, '5000', 1, '2026-05-02 22:26:55', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (58, 8, 8, 'ha ', 1, '2026-05-02 22:27:01', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (59, 8, 7, 'kinhds', 1, '2026-05-03 12:58:38', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (60, 8, 7, 'hi', 1, '2026-05-03 13:54:57', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (61, 7, 4, 'hi', 0, '2026-05-11 16:42:23', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (62, 8, 8, 'hi', 1, '2026-05-14 09:09:01', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (63, 17, 7, 'hi', 1, '2026-05-15 00:24:47', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (64, 17, 8, 'hi', 1, '2026-05-15 00:25:23', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (65, 18, 7, 'hi', 1, '2026-05-15 01:04:26', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (66, 18, 8, 'hi', 1, '2026-05-15 01:04:39', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (67, 18, 7, 'gana wdi', 1, '2026-05-15 01:04:45', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (68, 13, 7, 'ji', 1, '2026-05-15 21:11:15', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (69, 18, 7, 'hi', 1, '2026-05-16 08:54:24', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (70, 19, 8, 'hi', 1, '2026-05-17 12:51:25', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (71, 19, 8, 'Hello! This is a test of the professional SaaS chat interface.', 1, '2026-05-17 13:06:10', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (72, 19, 7, 'hi', 1, '2026-05-17 13:06:56', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (73, 19, 7, '', 1, '2026-05-18 23:16:45', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (74, 19, 8, 'nice', 1, '2026-05-18 23:21:33', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (75, 19, 8, '👍🤘', 1, '2026-05-18 23:22:13', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (76, 19, 8, '🤟', 1, '2026-05-18 23:23:02', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (77, 19, 8, '😚😚😚', 1, '2026-05-18 23:24:21', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (78, 19, 8, '😀🥰🤟', 1, '2026-05-18 23:24:53', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (79, 19, 7, 'hi hi', 1, '2026-05-18 23:24:55', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (80, 19, 7, '😇😇', 1, '2026-05-18 23:25:01', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (82, 17, 8, 'hi', 1, '2026-05-19 00:07:17', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (83, 17, 8, '😇😇😇😇😇😇', 1, '2026-05-20 22:56:06', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (84, 17, 8, 'okn', 1, '2026-05-24 19:59:47', 'BID_CHANGE', 34.00, 'ACCEPTED');
INSERT INTO `chat_messages` VALUES (85, 20, 7, 'hi', 1, '2026-05-24 20:30:14', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (86, 20, 7, 'can you reduce the price', 1, '2026-05-24 20:30:27', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (87, 20, 8, 'ah wait', 1, '2026-05-24 20:31:00', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (88, 20, 8, 'onna mn bid eka wns kra', 1, '2026-05-24 20:31:15', 'BID_CHANGE', 12.00, 'ACCEPTED');
INSERT INTO `chat_messages` VALUES (89, 20, 7, 'ji', 1, '2026-06-04 23:31:12', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (91, 12, 8, 'Proposed new bid amount: $500', 0, '2026-06-06 21:26:09', 'BID_CHANGE', 500.00, 'PENDING');
INSERT INTO `chat_messages` VALUES (92, 21, 7, 'hello', 1, '2026-06-06 21:32:33', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (93, 21, 7, 'thawa tikk adu kn barida?', 1, '2026-06-06 21:32:53', 'TEXT', NULL, NULL);
INSERT INTO `chat_messages` VALUES (94, 21, 8, 'adu kra', 1, '2026-06-06 21:33:34', 'BID_CHANGE', 100.00, 'ACCEPTED');
INSERT INTO `chat_messages` VALUES (95, 21, 7, '🙂🙂🙂', 0, '2026-06-06 21:41:00', 'TEXT', NULL, NULL);

-- ----------------------------
-- Table structure for chat_sessions
-- ----------------------------
DROP TABLE IF EXISTS `chat_sessions`;
CREATE TABLE `chat_sessions`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `task_id` bigint NOT NULL,
  `customer_id` bigint NOT NULL,
  `writer_id` bigint NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `task_id`(`task_id` ASC) USING BTREE,
  INDEX `customer_id`(`customer_id` ASC) USING BTREE,
  INDEX `writer_id`(`writer_id` ASC) USING BTREE,
  CONSTRAINT `chat_sessions_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `chat_sessions_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `chat_sessions_ibfk_3` FOREIGN KEY (`writer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chat_sessions
-- ----------------------------
INSERT INTO `chat_sessions` VALUES (1, 13, 6, 6, 1, '2026-04-26 21:51:07', '2026-04-26 21:51:07');
INSERT INTO `chat_sessions` VALUES (2, 15, 4, 4, 1, '2026-04-27 22:37:19', '2026-04-27 22:37:19');
INSERT INTO `chat_sessions` VALUES (3, 16, 4, 6, 1, '2026-04-27 23:45:39', '2026-04-27 23:45:39');
INSERT INTO `chat_sessions` VALUES (4, 17, 4, 6, 1, '2026-04-27 23:58:51', '2026-04-27 23:58:51');
INSERT INTO `chat_sessions` VALUES (5, 18, 4, 6, 1, '2026-04-28 00:33:41', '2026-04-28 00:33:41');
INSERT INTO `chat_sessions` VALUES (6, 19, 4, 6, 1, '2026-05-01 17:04:03', '2026-05-01 17:04:03');
INSERT INTO `chat_sessions` VALUES (7, 20, 4, 6, 1, '2026-05-02 09:38:02', '2026-05-02 09:38:02');
INSERT INTO `chat_sessions` VALUES (8, 21, 7, 8, 1, '2026-05-02 22:20:49', '2026-05-02 22:20:49');
INSERT INTO `chat_sessions` VALUES (9, 23, 7, 8, 1, '2026-05-03 13:07:58', '2026-05-03 13:07:58');
INSERT INTO `chat_sessions` VALUES (10, 24, 7, 8, 1, '2026-05-03 13:14:20', '2026-05-03 13:14:20');
INSERT INTO `chat_sessions` VALUES (11, 25, 7, 8, 1, '2026-05-03 13:20:35', '2026-05-03 13:20:35');
INSERT INTO `chat_sessions` VALUES (12, 26, 7, 8, 1, '2026-05-03 13:43:42', '2026-05-03 13:43:42');
INSERT INTO `chat_sessions` VALUES (13, 27, 7, 8, 1, '2026-05-03 13:47:50', '2026-05-03 13:47:50');
INSERT INTO `chat_sessions` VALUES (14, 28, 7, 8, 1, '2026-05-03 13:53:09', '2026-05-03 13:53:09');
INSERT INTO `chat_sessions` VALUES (15, 29, 7, 8, 1, '2026-05-03 13:58:50', '2026-05-03 13:58:50');
INSERT INTO `chat_sessions` VALUES (16, 30, 7, 8, 1, '2026-05-03 23:57:28', '2026-05-03 23:57:28');
INSERT INTO `chat_sessions` VALUES (17, 33, 7, 8, 1, '2026-05-15 00:24:42', '2026-05-15 00:24:42');
INSERT INTO `chat_sessions` VALUES (18, 34, 7, 8, 0, '2026-05-15 01:04:23', '2026-05-19 00:03:10');
INSERT INTO `chat_sessions` VALUES (19, 32, 7, 8, 0, '2026-05-17 12:50:48', '2026-05-18 23:33:10');
INSERT INTO `chat_sessions` VALUES (20, 35, 7, 8, 0, '2026-05-24 20:30:02', '2026-06-04 23:35:13');
INSERT INTO `chat_sessions` VALUES (21, 37, 7, 8, 1, '2026-06-06 21:32:16', '2026-06-06 21:32:16');

-- ----------------------------
-- Table structure for education_levels
-- ----------------------------
DROP TABLE IF EXISTS `education_levels`;
CREATE TABLE `education_levels`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `display_order` int NULL DEFAULT NULL,
  `is_active` tinyint(1) NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of education_levels
-- ----------------------------
INSERT INTO `education_levels` VALUES (1, 'High School', NULL, 1, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `education_levels` VALUES (2, 'Undergraduate', NULL, 2, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `education_levels` VALUES (3, 'Master\'s Degree', NULL, 3, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `education_levels` VALUES (4, 'Doctorate (PhD)', NULL, 4, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `education_levels` VALUES (5, 'Professional Certificate', NULL, 5, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);

-- ----------------------------
-- Table structure for fields
-- ----------------------------
DROP TABLE IF EXISTS `fields`;
CREATE TABLE `fields`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `parent_id` bigint NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE,
  INDEX `parent_id`(`parent_id` ASC) USING BTREE,
  CONSTRAINT `fields_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fields
-- ----------------------------

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `notification_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `related_id` bigint NULL DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_delete` tinyint(1) NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 145 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notifications
-- ----------------------------
INSERT INTO `notifications` VALUES (1, 4, 'Bid Accepted!', 'Your bid for task \'seniya task\' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 8, 1, '2026-04-25 16:32:42', 0, '2026-04-27 22:58:16', NULL);
INSERT INTO `notifications` VALUES (2, 5, 'Bid Accepted!', 'Your bid for task \'sfsfsf\' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 5, 1, '2026-04-25 16:41:25', 0, '2026-05-02 09:46:18', NULL);
INSERT INTO `notifications` VALUES (3, 4, 'Bid Accepted!', 'Your bid for task \'software assignment\' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 10, 1, '2026-04-25 16:46:04', 0, '2026-04-27 22:58:14', NULL);
INSERT INTO `notifications` VALUES (4, 6, 'Bid Accepted!', 'Your bid for task \'Software Project\' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 11, 1, '2026-04-26 21:36:51', 0, '2026-04-28 00:36:38', NULL);
INSERT INTO `notifications` VALUES (5, 6, 'Bid Accepted!', 'Your bid for task \'Software Project 2\' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 12, 1, '2026-04-26 21:41:05', 0, '2026-04-28 00:36:35', NULL);
INSERT INTO `notifications` VALUES (6, 6, 'Bid Accepted!', 'Your bid for task \'soft3\' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 13, 1, '2026-04-26 21:51:07', 0, '2026-04-28 00:36:31', NULL);
INSERT INTO `notifications` VALUES (7, 4, 'Bid Accepted!', 'Your bid for task \'adiwasiya 2\' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 15, 1, '2026-04-27 22:37:19', 0, '2026-04-27 22:58:11', NULL);
INSERT INTO `notifications` VALUES (8, 6, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:10:13', 0, '2026-04-28 00:15:29', NULL);
INSERT INTO `notifications` VALUES (9, 6, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:10:29', 0, '2026-04-28 00:15:23', NULL);
INSERT INTO `notifications` VALUES (10, 4, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:17:34', 0, '2026-04-28 00:17:55', NULL);
INSERT INTO `notifications` VALUES (11, 4, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:20:29', 0, '2026-04-28 00:25:51', NULL);
INSERT INTO `notifications` VALUES (12, 4, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:20:42', 0, '2026-04-28 00:20:56', NULL);
INSERT INTO `notifications` VALUES (13, 6, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:21:06', 0, '2026-04-28 00:21:35', NULL);
INSERT INTO `notifications` VALUES (14, 6, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:21:18', 0, '2026-04-28 00:21:25', NULL);
INSERT INTO `notifications` VALUES (15, 4, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:21:47', 0, '2026-04-28 00:22:10', NULL);
INSERT INTO `notifications` VALUES (16, 4, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:21:51', 0, '2026-04-28 00:22:07', NULL);
INSERT INTO `notifications` VALUES (17, 4, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:21:58', 0, '2026-04-28 00:25:51', NULL);
INSERT INTO `notifications` VALUES (18, 4, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:25:37', 0, '2026-04-28 00:25:51', NULL);
INSERT INTO `notifications` VALUES (19, 4, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:25:44', 0, '2026-04-28 00:25:51', NULL);
INSERT INTO `notifications` VALUES (20, 4, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:25:48', 0, '2026-04-28 00:25:51', NULL);
INSERT INTO `notifications` VALUES (21, 4, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:26:09', 0, '2026-04-28 00:26:30', NULL);
INSERT INTO `notifications` VALUES (22, 4, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:26:14', 0, '2026-04-28 00:26:30', NULL);
INSERT INTO `notifications` VALUES (23, 4, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 1, '2026-04-28 00:26:18', 0, '2026-04-28 00:26:29', NULL);
INSERT INTO `notifications` VALUES (24, 4, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 0, '2026-04-28 00:28:19', 0, '2026-04-28 00:28:19', NULL);
INSERT INTO `notifications` VALUES (25, 4, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 0, '2026-04-28 00:28:22', 0, '2026-04-28 00:28:22', NULL);
INSERT INTO `notifications` VALUES (26, 4, 'New Message', 'You received a new message regarding task: \'Meka thma title eka\'', 'NEW_MESSAGE', 4, 0, '2026-04-28 00:29:59', 0, '2026-04-28 00:29:59', NULL);
INSERT INTO `notifications` VALUES (27, 6, 'New Message', 'You received a new message regarding task: \'Adiwasiya Project 2\'', 'NEW_MESSAGE', 5, 1, '2026-04-28 00:34:32', 0, '2026-04-28 00:37:54', NULL);
INSERT INTO `notifications` VALUES (28, 6, 'New Message', 'You received a new message regarding task: \'Adiwasiya Project 2\'', 'NEW_MESSAGE', 5, 1, '2026-04-28 00:34:37', 0, '2026-04-28 00:34:50', NULL);
INSERT INTO `notifications` VALUES (29, 4, 'New Message', 'You received a new message regarding task: \'Adiwasiya Project 2\'', 'NEW_MESSAGE', 5, 0, '2026-04-28 00:34:56', 0, '2026-04-28 00:34:56', NULL);
INSERT INTO `notifications` VALUES (30, 4, 'New Message', 'You received a new message regarding task: \'Adiwasiya Project 2\'', 'NEW_MESSAGE', 5, 1, '2026-04-28 00:35:00', 0, '2026-05-11 16:44:28', NULL);
INSERT INTO `notifications` VALUES (31, 6, 'New Message', 'You received a new message regarding task: \'Senadhi Project 3333\'', 'NEW_MESSAGE', 6, 1, '2026-05-01 17:04:32', 0, '2026-05-01 17:04:43', NULL);
INSERT INTO `notifications` VALUES (32, 4, 'New Message', 'You received a new message regarding task: \'Senadhi Project 3333\'', 'NEW_MESSAGE', 6, 1, '2026-05-01 17:04:51', 0, '2026-05-11 16:41:08', NULL);
INSERT INTO `notifications` VALUES (33, 6, 'New Message', 'You received a new message regarding task: \'Senadhi Project 3333\'', 'NEW_MESSAGE', 6, 1, '2026-05-01 17:04:56', 0, '2026-05-01 17:17:32', NULL);
INSERT INTO `notifications` VALUES (34, 6, 'Bid Accepted!', 'Your bid for task \'Senadhi Project 3333\' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 19, 1, '2026-05-01 17:05:05', 0, '2026-05-01 17:05:38', NULL);
INSERT INTO `notifications` VALUES (35, 6, 'Bid Accepted!', 'Your bid for task \'Adiwasiya Project 2\' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 18, 1, '2026-05-01 17:44:43', 0, '2026-05-01 18:11:26', NULL);
INSERT INTO `notifications` VALUES (36, 6, 'New Message', 'You received a new message regarding task: \'Udantha Assignment Software \'', 'NEW_MESSAGE', 7, 1, '2026-05-02 09:38:45', 0, '2026-05-02 09:38:56', NULL);
INSERT INTO `notifications` VALUES (37, 4, 'New Message', 'You received a new message regarding task: \'Udantha Assignment Software \'', 'NEW_MESSAGE', 7, 1, '2026-05-02 09:39:00', 0, '2026-05-10 20:12:19', NULL);
INSERT INTO `notifications` VALUES (38, 6, 'Bid Accepted!', 'Your bid for task \'Udantha Assignment Software \' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 20, 1, '2026-05-02 09:40:20', 0, '2026-05-02 09:41:22', NULL);
INSERT INTO `notifications` VALUES (39, 8, 'New Message', 'You received a new message regarding task: \'Software ENginerr Assignment by dulshika\'', 'NEW_MESSAGE', 8, 1, '2026-05-02 22:21:20', 0, '2026-05-19 00:34:23', NULL);
INSERT INTO `notifications` VALUES (40, 8, 'New Message', 'You received a new message regarding task: \'Software ENginerr Assignment by dulshika\'', 'NEW_MESSAGE', 8, 1, '2026-05-02 22:22:54', 0, '2026-05-02 22:26:37', NULL);
INSERT INTO `notifications` VALUES (41, 7, 'New Message', 'You received a new message regarding task: \'Software ENginerr Assignment by dulshika\'', 'NEW_MESSAGE', 8, 1, '2026-05-02 22:26:49', 0, '2026-05-03 13:06:43', NULL);
INSERT INTO `notifications` VALUES (42, 8, 'New Message', 'You received a new message regarding task: \'Software ENginerr Assignment by dulshika\'', 'NEW_MESSAGE', 8, 1, '2026-05-02 22:26:55', 0, '2026-05-19 00:34:23', NULL);
INSERT INTO `notifications` VALUES (43, 7, 'New Message', 'You received a new message regarding task: \'Software ENginerr Assignment by dulshika\'', 'NEW_MESSAGE', 8, 1, '2026-05-02 22:27:01', 0, '2026-05-03 12:58:33', NULL);
INSERT INTO `notifications` VALUES (44, 8, 'Bid Accepted!', 'Your bid for task \'Software ENginerr Assignment by dulshika\' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 21, 1, '2026-05-02 22:28:39', 0, '2026-05-02 22:28:47', NULL);
INSERT INTO `notifications` VALUES (45, 8, 'New Message', 'You received a new message regarding task: \'Software ENginerr Assignment by dulshika\'', 'NEW_MESSAGE', 8, 1, '2026-05-03 12:58:38', 0, '2026-05-19 00:34:23', NULL);
INSERT INTO `notifications` VALUES (46, 8, 'Bid Accepted!', 'Your bid for task \'plmp pk r pkmr\' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 28, 1, '2026-05-03 13:53:42', 0, '2026-05-03 13:59:27', NULL);
INSERT INTO `notifications` VALUES (47, 8, 'New Message', 'You received a new message regarding task: \'Software ENginerr Assignment by dulshika\'', 'NEW_MESSAGE', 8, 1, '2026-05-03 13:54:57', 0, '2026-05-13 22:48:39', NULL);
INSERT INTO `notifications` VALUES (48, 8, 'Bid Accepted!', 'Your bid for task \'lknpkn pknpm pmpm \' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 29, 1, '2026-05-03 14:00:42', 0, '2026-05-03 14:00:47', NULL);
INSERT INTO `notifications` VALUES (49, 8, 'New Files Added', 'The client added 1 new file(s) to project \'lknpkn pknpm pmpm \'', 'FILES_ADDED', 29, 1, '2026-05-03 23:54:51', 0, '2026-05-19 00:34:23', NULL);
INSERT INTO `notifications` VALUES (50, 7, 'New Bid Received!', 'Seniya Wishwajith has placed a new bid of $120.0 on your project \'New task with file uload\'.', 'BID_RECEIVED', 30, 1, '2026-05-03 23:57:28', 0, '2026-05-03 23:57:38', NULL);
INSERT INTO `notifications` VALUES (51, 8, 'Bid Accepted!', 'Your bid for task \'New task with file uload\' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 30, 1, '2026-05-03 23:57:50', 0, '2026-05-04 00:00:15', NULL);
INSERT INTO `notifications` VALUES (52, 6, 'New Files Added', 'The client added 1 new file(s) to project \'Udantha Assignment Software \'', 'FILES_ADDED', 20, 0, '2026-05-10 20:11:52', 0, '2026-05-10 20:11:52', NULL);
INSERT INTO `notifications` VALUES (53, 6, 'New Message', 'You received a new message regarding task: \'Udantha Assignment Software \'', 'NEW_MESSAGE', 7, 0, '2026-05-11 16:42:23', 0, '2026-05-11 16:42:23', NULL);
INSERT INTO `notifications` VALUES (54, 8, 'New Files Added', 'The client added 1 new file(s) to project \'New task with file uload\'', 'FILES_ADDED', 30, 1, '2026-05-11 17:52:14', 0, '2026-05-19 00:34:23', NULL);
INSERT INTO `notifications` VALUES (55, 7, 'New Message', 'You received a new message regarding task: \'Software ENginerr Assignment by dulshika\'', 'NEW_MESSAGE', 8, 1, '2026-05-14 09:09:01', 0, '2026-05-14 09:09:11', NULL);
INSERT INTO `notifications` VALUES (56, 7, 'New Bid Received!', 'Seniya Wishwajith has placed a new bid of $120.0 on your project \'New Assignment 33\'.', 'BID_RECEIVED', 33, 0, '2026-05-15 00:05:27', 0, '2026-05-15 00:05:27', NULL);
INSERT INTO `notifications` VALUES (57, 7, 'Bid Updated!', 'Seniya Wishwajith has updated their bid to $120.0 on your project \'New Assignment 33\'.', 'BID_RECEIVED', 33, 0, '2026-05-15 00:05:46', 0, '2026-05-15 00:05:46', NULL);
INSERT INTO `notifications` VALUES (58, 7, 'Bid Updated!', 'Seniya Wishwajith has updated their bid to $122.0 on your project \'New Assignment 33\'.', 'BID_RECEIVED', 33, 1, '2026-05-15 00:14:58', 0, '2026-05-15 00:15:18', NULL);
INSERT INTO `notifications` VALUES (59, 8, 'New Message', 'You received a new message regarding task: \'New Assignment 33\'', 'NEW_MESSAGE', 17, 1, '2026-05-15 00:24:47', 0, '2026-05-15 00:25:19', NULL);
INSERT INTO `notifications` VALUES (60, 7, 'New Message', 'You received a new message regarding task: \'New Assignment 33\'', 'NEW_MESSAGE', 17, 1, '2026-05-15 00:25:23', 0, '2026-05-15 00:25:34', NULL);
INSERT INTO `notifications` VALUES (61, 8, 'Bid Accepted!', 'Your bid for task \'New Assignment 33\' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 33, 1, '2026-05-15 00:25:59', 0, '2026-05-15 00:26:13', NULL);
INSERT INTO `notifications` VALUES (62, 8, 'New Files Added', 'The client added 3 new file(s) to project \'New Assignment 33\'', 'FILES_ADDED', 33, 1, '2026-05-15 00:39:34', 0, '2026-05-19 00:34:23', NULL);
INSERT INTO `notifications` VALUES (63, 8, 'New Files Added', 'The client added 2 new file(s) to project \'New Assignment 33\'', 'FILES_ADDED', 33, 1, '2026-05-15 00:51:23', 0, '2026-05-19 00:34:23', NULL);
INSERT INTO `notifications` VALUES (64, 8, 'New Files Added', 'The client added 1 new file(s) to project \'New Assignment 33\'', 'FILES_ADDED', 33, 1, '2026-05-15 00:52:24', 0, '2026-05-19 00:34:22', NULL);
INSERT INTO `notifications` VALUES (65, 8, 'New Files Added', 'The client added 1 new file(s) to project \'New Assignment 33\'', 'FILES_ADDED', 33, 1, '2026-05-15 00:54:43', 0, '2026-05-19 00:34:22', NULL);
INSERT INTO `notifications` VALUES (66, 7, 'New Bid Received!', 'Seniya Wishwajith has placed a new bid of $120.0 on your project \'Madhawa Task 1\'.', 'BID_RECEIVED', 34, 1, '2026-05-15 01:02:07', 0, '2026-05-15 01:02:15', NULL);
INSERT INTO `notifications` VALUES (67, 8, 'New Message', 'You received a new message regarding task: \'Madhawa Task 1\'', 'NEW_MESSAGE', 18, 1, '2026-05-15 01:04:26', 0, '2026-05-15 01:04:36', NULL);
INSERT INTO `notifications` VALUES (68, 7, 'New Message', 'You received a new message regarding task: \'Madhawa Task 1\'', 'NEW_MESSAGE', 18, 0, '2026-05-15 01:04:39', 0, '2026-05-15 01:04:39', NULL);
INSERT INTO `notifications` VALUES (69, 8, 'New Message', 'You received a new message regarding task: \'Madhawa Task 1\'', 'NEW_MESSAGE', 18, 1, '2026-05-15 01:04:45', 0, '2026-05-19 00:34:22', NULL);
INSERT INTO `notifications` VALUES (70, 7, 'Bid Updated!', 'Seniya Wishwajith has updated their bid to $10.0 on your project \'Madhawa Task 1\'.', 'BID_RECEIVED', 34, 1, '2026-05-15 01:05:11', 0, '2026-05-15 01:05:18', NULL);
INSERT INTO `notifications` VALUES (71, 8, 'Bid Accepted!', 'Your bid for task \'Madhawa Task 1\' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 34, 1, '2026-05-15 01:05:23', 0, '2026-05-19 00:34:22', NULL);
INSERT INTO `notifications` VALUES (72, 8, 'New Files Added', 'The client added 1 new file(s) to project \'Madhawa Task 1\'', 'FILES_ADDED', 34, 1, '2026-05-15 01:06:09', 0, '2026-05-19 00:34:22', NULL);
INSERT INTO `notifications` VALUES (73, 8, 'New Files Added', 'The client added 1 new file(s) to project \'Madhawa Task 1\'', 'FILES_ADDED', 34, 1, '2026-05-15 01:06:32', 0, '2026-05-19 00:34:22', NULL);
INSERT INTO `notifications` VALUES (74, 8, 'New Files Added', 'The client added 1 new file(s) to project \'Madhawa Task 1\'', 'FILES_ADDED', 34, 1, '2026-05-15 01:06:55', 0, '2026-05-19 00:34:22', NULL);
INSERT INTO `notifications` VALUES (75, 8, 'New Message', 'You received a new message regarding task: \'test lojb on \'', 'NEW_MESSAGE', 13, 1, '2026-05-15 21:11:15', 0, '2026-05-15 23:01:25', NULL);
INSERT INTO `notifications` VALUES (76, 8, 'New Files Added', 'The client added 1 new file(s) to project \'Madhawa Task 1\'', 'FILES_ADDED', 34, 1, '2026-05-15 21:13:15', 0, '2026-05-15 21:16:43', NULL);
INSERT INTO `notifications` VALUES (77, 8, 'New Files Added', 'The client added 1 new file(s) to project \'Madhawa Task 1\'', 'FILES_ADDED', 34, 1, '2026-05-15 21:14:05', 0, '2026-05-15 21:16:38', NULL);
INSERT INTO `notifications` VALUES (78, 8, 'New Files Added', 'The client added 1 new file(s) to project \'Madhawa Task 1\'', 'FILES_ADDED', 34, 1, '2026-05-15 21:37:31', 0, '2026-05-15 23:01:33', NULL);
INSERT INTO `notifications` VALUES (79, 8, 'New Files Added', 'The client added 1 new file(s) to project \'Madhawa Task 1\'', 'FILES_ADDED', 34, 1, '2026-05-15 22:14:44', 0, '2026-05-19 00:34:22', NULL);
INSERT INTO `notifications` VALUES (80, 8, 'Task Approved!', 'The client has approved your work for task \'Madhawa Task 1\' and released the payment.', 'TASK_COMPLETED', 34, 1, '2026-05-16 07:28:25', 0, '2026-05-19 00:34:22', NULL);
INSERT INTO `notifications` VALUES (81, 8, 'New Message', 'You received a new message regarding task: \'Madhawa Task 1\'', 'NEW_MESSAGE', 18, 1, '2026-05-16 08:54:24', 0, '2026-05-17 12:48:41', NULL);
INSERT INTO `notifications` VALUES (82, 8, 'New Files Added', 'The client added 1 new file(s) to project \'Madhawa Task 1\'', 'FILES_ADDED', 34, 1, '2026-05-16 19:57:38', 0, '2026-05-17 09:00:48', NULL);
INSERT INTO `notifications` VALUES (83, 8, 'Revision Requested', 'The client requested a revision for project \'Madhawa Task 1\'', 'REVISION_REQUESTED', 34, 1, '2026-05-17 09:05:46', 0, '2026-05-17 09:05:58', NULL);
INSERT INTO `notifications` VALUES (84, 7, 'Work Delivered', 'The writer has submitted the completed work for project \'Madhawa Task 1\'', 'WORK_DELIVERED', 34, 1, '2026-05-17 09:27:50', 0, '2026-05-17 09:28:04', NULL);
INSERT INTO `notifications` VALUES (85, 8, 'Task Approved!', 'The client has approved your work for task \'Madhawa Task 1\' and released the payment!', 'TASK_APPROVED', 34, 1, '2026-05-17 09:59:06', 0, '2026-05-19 00:34:22', NULL);
INSERT INTO `notifications` VALUES (86, 8, 'New Review Received!', 'A customer rated you ★★★ for project \'Madhawa Task 1\'!', 'REVIEW_RECEIVED', 34, 1, '2026-05-17 10:41:06', 0, '2026-05-19 00:34:22', NULL);
INSERT INTO `notifications` VALUES (87, 7, 'New Bid Received!', 'Seniya Rajarathna has placed a new bid of $20.0 on your project \'Task 4 with files\'.', 'BID_RECEIVED', 32, 1, '2026-05-17 12:26:15', 0, '2026-05-18 23:06:54', NULL);
INSERT INTO `notifications` VALUES (88, 8, 'Bid Accepted!', 'Your bid for task \'Task 4 with files\' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 32, 1, '2026-05-17 12:50:48', 0, '2026-05-17 12:51:06', NULL);
INSERT INTO `notifications` VALUES (89, 7, 'New Message', 'You received a new message regarding task: \'Task 4 with files\'', 'NEW_MESSAGE', 19, 0, '2026-05-17 12:51:25', 0, '2026-05-17 12:51:25', NULL);
INSERT INTO `notifications` VALUES (90, 7, 'Work Delivered', 'The writer has submitted the completed work for project \'Task 4 with files\'', 'WORK_DELIVERED', 32, 0, '2026-05-17 12:52:05', 0, '2026-05-17 12:52:05', NULL);
INSERT INTO `notifications` VALUES (91, 8, 'Revision Requested', 'The client requested a revision for project \'Task 4 with files\'', 'REVISION_REQUESTED', 32, 1, '2026-05-17 12:52:47', 0, '2026-05-18 23:15:37', NULL);
INSERT INTO `notifications` VALUES (92, 8, 'Revision Requested', 'The client requested a revision for project \'Task 4 with files\'', 'REVISION_REQUESTED', 32, 1, '2026-05-17 12:53:46', 0, '2026-05-18 22:59:54', NULL);
INSERT INTO `notifications` VALUES (93, 7, 'Revision Delivered', 'The writer has submitted revised files for project \'Task 4 with files\'', 'REVISION_DELIVERED', 32, 1, '2026-05-17 12:54:22', 0, '2026-05-17 12:58:28', NULL);
INSERT INTO `notifications` VALUES (94, 8, 'Task Approved!', 'The client has approved your work for task \'Task 4 with files\' and released the payment!', 'TASK_APPROVED', 32, 1, '2026-05-17 12:54:41', 0, '2026-05-18 22:59:47', NULL);
INSERT INTO `notifications` VALUES (95, 8, 'New Review Received!', 'A customer rated you ★★★★ for project \'Task 4 with files\'!', 'REVIEW_RECEIVED', 32, 1, '2026-05-17 12:54:56', 0, '2026-05-18 22:59:43', NULL);
INSERT INTO `notifications` VALUES (96, 7, 'New Message', 'You received a new message regarding task: \'Task 4 with files\'', 'NEW_MESSAGE', 19, 1, '2026-05-17 13:06:10', 0, '2026-05-18 23:06:43', NULL);
INSERT INTO `notifications` VALUES (97, 8, 'New Message', 'You received a new message regarding task: \'Task 4 with files\'', 'NEW_MESSAGE', 19, 1, '2026-05-17 13:06:56', 0, '2026-05-18 22:59:34', NULL);
INSERT INTO `notifications` VALUES (98, 8, 'Revision Requested', 'The client requested a revision for project \'New Assignment 33\'', 'REVISION_REQUESTED', 33, 1, '2026-05-18 23:13:50', 0, '2026-05-18 23:14:17', NULL);
INSERT INTO `notifications` VALUES (99, 8, 'New Message', 'You received a new message regarding task: \'Task 4 with files\'', 'NEW_MESSAGE', 19, 1, '2026-05-18 23:16:45', 0, '2026-05-19 00:34:22', NULL);
INSERT INTO `notifications` VALUES (100, 7, 'New Message', 'You received a new message regarding task: \'Task 4 with files\'', 'NEW_MESSAGE', 19, 0, '2026-05-18 23:21:33', 0, '2026-05-18 23:21:33', NULL);
INSERT INTO `notifications` VALUES (101, 7, 'New Message', 'You received a new message regarding task: \'Task 4 with files\'', 'NEW_MESSAGE', 19, 0, '2026-05-18 23:22:13', 0, '2026-05-18 23:22:13', NULL);
INSERT INTO `notifications` VALUES (102, 7, 'New Message', 'You received a new message regarding task: \'Task 4 with files\'', 'NEW_MESSAGE', 19, 0, '2026-05-18 23:23:02', 0, '2026-05-18 23:23:02', NULL);
INSERT INTO `notifications` VALUES (103, 7, 'New Message', 'You received a new message regarding task: \'Task 4 with files\'', 'NEW_MESSAGE', 19, 0, '2026-05-18 23:24:21', 0, '2026-05-18 23:24:21', NULL);
INSERT INTO `notifications` VALUES (104, 7, 'New Message', 'You received a new message regarding task: \'Task 4 with files\'', 'NEW_MESSAGE', 19, 0, '2026-05-18 23:24:53', 0, '2026-05-18 23:24:53', NULL);
INSERT INTO `notifications` VALUES (105, 8, 'New Message', 'You received a new message regarding task: \'Task 4 with files\'', 'NEW_MESSAGE', 19, 1, '2026-05-18 23:24:55', 0, '2026-05-19 00:34:22', NULL);
INSERT INTO `notifications` VALUES (106, 8, 'New Message', 'You received a new message regarding task: \'Task 4 with files\'', 'NEW_MESSAGE', 19, 1, '2026-05-18 23:25:01', 0, '2026-05-19 00:29:48', NULL);
INSERT INTO `notifications` VALUES (107, 7, 'New Message', 'You received a new message regarding task: \'New Assignment 33\'', 'NEW_MESSAGE', 17, 0, '2026-05-19 00:07:08', 0, '2026-05-19 00:07:08', NULL);
INSERT INTO `notifications` VALUES (108, 7, 'New Message', 'You received a new message regarding task: \'New Assignment 33\'', 'NEW_MESSAGE', 17, 0, '2026-05-19 00:07:17', 0, '2026-05-19 00:07:17', NULL);
INSERT INTO `notifications` VALUES (109, 7, 'New Message', 'You received a new message regarding task: \'New Assignment 33\'', 'NEW_MESSAGE', 17, 1, '2026-05-20 22:56:06', 0, '2026-05-24 23:49:59', NULL);
INSERT INTO `notifications` VALUES (110, 7, 'Bid Change Requested', 'Seniya Rajarathna has requested to change the bid to $34.00 for task \'New Assignment 33\'', 'BID_CHANGE_REQUESTED', 17, 1, '2026-05-24 19:59:47', 0, '2026-05-24 20:00:11', NULL);
INSERT INTO `notifications` VALUES (111, 7, 'New Bid Received!', 'Seniya Rajarathna has placed a new bid of $5.0 on your project \'Change bit checking task\'.', 'BID_RECEIVED', 35, 0, '2026-05-24 20:11:45', 0, '2026-05-24 20:11:45', NULL);
INSERT INTO `notifications` VALUES (112, 7, 'Bid Updated!', 'Seniya Rajarathna has updated their bid to $50.0 on your project \'Change bit checking task\'.', 'BID_RECEIVED', 35, 1, '2026-05-24 20:11:53', 0, '2026-05-24 20:12:07', NULL);
INSERT INTO `notifications` VALUES (113, 8, 'New Message', 'You received a new message regarding task: \'Change bit checking task\'', 'NEW_MESSAGE', 20, 1, '2026-05-24 20:30:14', 0, '2026-05-24 20:33:19', NULL);
INSERT INTO `notifications` VALUES (114, 8, 'New Message', 'You received a new message regarding task: \'Change bit checking task\'', 'NEW_MESSAGE', 20, 1, '2026-05-24 20:30:27', 0, '2026-05-24 20:30:54', NULL);
INSERT INTO `notifications` VALUES (115, 7, 'New Message', 'You received a new message regarding task: \'Change bit checking task\'', 'NEW_MESSAGE', 20, 1, '2026-05-24 20:31:00', 0, '2026-05-24 23:49:51', NULL);
INSERT INTO `notifications` VALUES (116, 7, 'Bid Change Requested', 'Seniya Rajarathna has requested to change the bid to $12.00 for task \'Change bit checking task\'', 'BID_CHANGE_REQUESTED', 20, 0, '2026-05-24 20:31:15', 0, '2026-05-24 20:31:15', NULL);
INSERT INTO `notifications` VALUES (117, 8, 'Bid Change Approved!', 'The client has approved your bid change to $12.00 for task \'Change bit checking task\'', 'BID_CHANGE_APPROVED', 35, 1, '2026-05-24 20:31:24', 0, '2026-05-24 20:33:04', NULL);
INSERT INTO `notifications` VALUES (118, 8, 'Bid Accepted!', 'Your bid for task \'test lojb on \' has been accepted. Please proceed with payment or assignment.', 'BID_ACCEPTED', 27, 1, '2026-05-24 20:37:04', 0, '2026-05-24 20:43:26', NULL);
INSERT INTO `notifications` VALUES (119, 8, 'Revision Requested', 'The client requested a revision for project \'New Assignment 33\'', 'REVISION_REQUESTED', 33, 1, '2026-05-24 20:43:21', 0, '2026-05-24 20:43:36', NULL);
INSERT INTO `notifications` VALUES (120, 7, 'Revision Delivered', 'The writer has submitted revised files for project \'New Assignment 33\'', 'REVISION_DELIVERED', 33, 0, '2026-05-24 20:43:50', 0, '2026-05-24 20:43:50', NULL);
INSERT INTO `notifications` VALUES (121, 7, 'Work Delivered', 'The writer has submitted the completed work for project \'New Assignment 33\'', 'WORK_DELIVERED', 33, 0, '2026-05-24 20:45:04', 0, '2026-05-24 20:45:04', NULL);
INSERT INTO `notifications` VALUES (122, 8, 'Revision Requested', 'The client requested a revision for project \'New Assignment 33\'', 'REVISION_REQUESTED', 33, 1, '2026-05-24 20:45:23', 0, '2026-05-24 20:50:49', NULL);
INSERT INTO `notifications` VALUES (123, 7, 'Revision Delivered', 'The writer has submitted revised files for project \'New Assignment 33\'', 'REVISION_DELIVERED', 33, 0, '2026-05-24 20:45:34', 0, '2026-05-24 20:45:34', NULL);
INSERT INTO `notifications` VALUES (124, 8, 'Bid Change Approved!', 'The client has approved your bid change to $34.00 for task \'New Assignment 33\'', 'BID_CHANGE_APPROVED', 33, 1, '2026-05-24 23:36:35', 0, '2026-06-04 22:56:37', NULL);
INSERT INTO `notifications` VALUES (125, 8, 'New Message', 'You received a new message regarding task: \'Change bit checking task\'', 'NEW_MESSAGE', 20, 0, '2026-06-04 23:31:12', 0, '2026-06-04 23:31:12', NULL);
INSERT INTO `notifications` VALUES (126, 8, 'New Message', 'You received a new message regarding task: \'Change bit checking task\'', 'NEW_MESSAGE', 20, 1, '2026-06-04 23:34:47', 0, '2026-06-06 21:33:01', NULL);
INSERT INTO `notifications` VALUES (127, 7, 'Bid Change Requested', 'Seniya Rajarathna has requested to change the bid to $500.00 for task \'Assignment 3\'', 'BID_CHANGE_REQUESTED', 12, 0, '2026-06-06 21:26:09', 0, '2026-06-06 21:26:09', NULL);
INSERT INTO `notifications` VALUES (128, 7, 'New Bid Received!', 'Seniya Rajarathna has placed a new bid of $200.0 on your project \'Software Assignment\'.', 'BID_RECEIVED', 37, 1, '2026-06-06 21:31:30', 0, '2026-06-06 21:31:41', NULL);
INSERT INTO `notifications` VALUES (129, 8, 'New Message', 'You received a new message regarding task: \'Software Assignment\'', 'NEW_MESSAGE', 21, 0, '2026-06-06 21:32:33', 0, '2026-06-06 21:32:33', NULL);
INSERT INTO `notifications` VALUES (130, 8, 'New Message', 'You received a new message regarding task: \'Software Assignment\'', 'NEW_MESSAGE', 21, 1, '2026-06-06 21:32:53', 0, '2026-06-06 21:33:21', NULL);
INSERT INTO `notifications` VALUES (131, 7, 'Bid Change Requested', 'Seniya Rajarathna has requested to change the bid to $100.00 for task \'Software Assignment\'', 'BID_CHANGE_REQUESTED', 21, 1, '2026-06-06 21:33:34', 0, '2026-06-06 21:33:46', NULL);
INSERT INTO `notifications` VALUES (132, 8, 'Bid Change Approved!', 'The client has approved your bid change to $100.00 for task \'Software Assignment\'', 'BID_CHANGE_APPROVED', 37, 1, '2026-06-06 21:33:39', 0, '2026-06-06 21:34:45', NULL);
INSERT INTO `notifications` VALUES (133, 7, 'Work Delivered', 'The writer has submitted the completed work for project \'Software Assignment\'', 'WORK_DELIVERED', 37, 1, '2026-06-06 21:35:47', 0, '2026-06-06 21:36:00', NULL);
INSERT INTO `notifications` VALUES (134, 8, 'Revision Requested', 'The client requested a revision for project \'Software Assignment\'', 'REVISION_REQUESTED', 37, 1, '2026-06-06 21:36:31', 0, '2026-06-06 21:37:05', NULL);
INSERT INTO `notifications` VALUES (135, 8, 'Task Approved!', 'The client has approved your work for task \'Software Assignment\' and released the payment!', 'TASK_APPROVED', 37, 0, '2026-06-06 21:38:26', 0, '2026-06-06 21:38:26', NULL);
INSERT INTO `notifications` VALUES (136, 8, 'New Review Received!', 'A customer rated you ★★★★★ for project \'Software Assignment\'!', 'REVIEW_RECEIVED', 37, 1, '2026-06-06 21:38:36', 0, '2026-06-06 21:38:50', NULL);
INSERT INTO `notifications` VALUES (137, 8, 'New Message', 'You received a new message regarding task: \'Software Assignment\'', 'NEW_MESSAGE', 21, 0, '2026-06-06 21:41:00', 0, '2026-06-06 21:41:00', NULL);
INSERT INTO `notifications` VALUES (138, 9, 'New Writer Application', 'Subashi Rajarathna has registered and is awaiting approval.', 'WRITER_REGISTRATION', 10, 1, '2026-06-07 00:03:30', 0, '2026-06-07 01:01:49', NULL);
INSERT INTO `notifications` VALUES (139, 10, 'Application Not Approved', 'Unfortunately, your writer application was not approved at this time. Please contact support for more information.', 'WRITER_REJECTED', 10, 1, '2026-06-07 00:04:13', 0, '2026-06-07 00:04:48', NULL);
INSERT INTO `notifications` VALUES (140, 9, 'New Writer Application', 'Hasith Randula has registered and is awaiting approval.', 'WRITER_REGISTRATION', 11, 1, '2026-06-07 00:15:05', 0, '2026-06-07 00:58:46', NULL);
INSERT INTO `notifications` VALUES (141, 11, 'Application Approved!', 'Congratulations! Your writer application has been approved. You can now start accepting tasks.', 'WRITER_APPROVED', 11, 1, '2026-06-07 00:25:57', 0, '2026-06-07 00:26:34', NULL);
INSERT INTO `notifications` VALUES (142, 9, 'New Support Ticket TKT-0001', 'A customer submitted a support ticket: \"pkmfpmregegeg\"', 'SUPPORT_TICKET', 1, 1, '2026-06-07 01:03:55', 0, '2026-06-07 01:04:08', NULL);
INSERT INTO `notifications` VALUES (143, 9, 'New Support Ticket TKT-0002', 'A customer submitted a support ticket: \"lkmrtgpkmrgbpmrbg\"', 'SUPPORT_TICKET', 2, 1, '2026-06-07 01:04:27', 0, '2026-06-07 01:04:38', NULL);
INSERT INTO `notifications` VALUES (144, 7, 'Reply on ticket TKT-0002', 'An admin has responded to your support ticket: \"lkmrtgpkmrgbpmrbg\"', 'SUPPORT_REPLY', 2, 0, '2026-06-07 01:04:45', 0, '2026-06-07 01:04:45', NULL);

-- ----------------------------
-- Table structure for payments
-- ----------------------------
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `task_id` bigint NOT NULL,
  `customer_id` bigint NOT NULL,
  `amount` decimal(10, 2) NOT NULL,
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `transaction_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `payment_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `task_id`(`task_id` ASC) USING BTREE,
  INDEX `customer_id`(`customer_id` ASC) USING BTREE,
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of payments
-- ----------------------------

-- ----------------------------
-- Table structure for reviews
-- ----------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `task_id` bigint NOT NULL,
  `customer_id` bigint NOT NULL,
  `writer_id` bigint NOT NULL,
  `rating` int NOT NULL,
  `feedback` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `task_id`(`task_id` ASC) USING BTREE,
  INDEX `customer_id`(`customer_id` ASC) USING BTREE,
  INDEX `writer_id`(`writer_id` ASC) USING BTREE,
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`writer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of reviews
-- ----------------------------
INSERT INTO `reviews` VALUES (1, 34, 7, 8, 3, 'this writer is very good\n', 0, '2026-05-17 10:41:06', '2026-05-17 10:41:06', NULL);
INSERT INTO `reviews` VALUES (2, 32, 7, 8, 4, 'Supiri writer\n', 0, '2026-05-17 12:54:56', '2026-05-17 12:54:56', NULL);
INSERT INTO `reviews` VALUES (3, 37, 7, 8, 5, 'supiri cora', 0, '2026-06-06 21:38:36', '2026-06-06 21:38:36', NULL);

-- ----------------------------
-- Table structure for revision_files
-- ----------------------------
DROP TABLE IF EXISTS `revision_files`;
CREATE TABLE `revision_files`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `revision_id` bigint NOT NULL,
  `uploaded_by_user_id` bigint NOT NULL,
  `file_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mime_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `file_size` bigint NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `revision_id`(`revision_id` ASC) USING BTREE,
  INDEX `uploaded_by_user_id`(`uploaded_by_user_id` ASC) USING BTREE,
  CONSTRAINT `revision_files_ibfk_1` FOREIGN KEY (`revision_id`) REFERENCES `task_revisions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `revision_files_ibfk_2` FOREIGN KEY (`uploaded_by_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of revision_files
-- ----------------------------
INSERT INTO `revision_files` VALUES (3, 37, 7, '/uploads/revisions/34_37_20260517083042865167_Screenshot_2026-01-13_160945.png', 'Screenshot 2026-01-13 160945.png', 'image/png', 129012, 0, '2026-05-17 08:30:42', '2026-05-17 08:30:42', NULL);
INSERT INTO `revision_files` VALUES (4, 38, 7, '/uploads/revisions/34_38_20260517083105417001_CSI3207_Assignment_2_Instructions_and_Rubric_v1.1_(1).docx', 'CSI3207 Assignment 2 Instructions and Rubric v1.1 (1).docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 97328, 0, '2026-05-17 08:31:05', '2026-05-17 08:31:05', NULL);
INSERT INTO `revision_files` VALUES (5, 39, 7, '/uploads/revisions/34_39_20260517083136909217_34_20260515010049_1.docx', '34_20260515010049_1.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 23380, 0, '2026-05-17 08:31:36', '2026-05-17 08:31:36', NULL);
INSERT INTO `revision_files` VALUES (6, 40, 7, '/uploads/revisions/34_40_20260517084038044634_CSI3207_Assignment_2_Instructions_and_Rubric_v1.1_(1).docx', 'CSI3207 Assignment 2 Instructions and Rubric v1.1 (1).docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 97328, 0, '2026-05-17 08:40:38', '2026-05-17 08:40:38', NULL);
INSERT INTO `revision_files` VALUES (7, 40, 7, '/uploads/revisions/34_40_20260517084038046348_34_20260515010049_1.docx', '34_20260515010049_1.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 23380, 0, '2026-05-17 08:40:38', '2026-05-17 08:40:38', NULL);
INSERT INTO `revision_files` VALUES (8, 40, 7, '/uploads/revisions/34_40_20260517084038142414_33_20260515003934_RL_Examplar_80.docx', '33_20260515003934_RL_Examplar_80.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 2216523, 0, '2026-05-17 08:40:38', '2026-05-17 08:40:38', NULL);
INSERT INTO `revision_files` VALUES (9, 40, 7, '/uploads/revisions/34_40_20260517084038151433_33_20260514235812_1.docx', '33_20260514235812_1.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 23380, 0, '2026-05-17 08:40:38', '2026-05-17 08:40:38', NULL);
INSERT INTO `revision_files` VALUES (10, 41, 7, '/uploads/revisions/34_41_20260517090012476633_33_20260514235812_1.docx', '33_20260514235812_1.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 23380, 0, '2026-05-17 09:00:12', '2026-05-17 09:00:12', NULL);
INSERT INTO `revision_files` VALUES (11, 42, 7, '/uploads/revisions/34_42_20260517090546911587_Screenshot_2026-01-13_151245.png', 'Screenshot 2026-01-13 151245.png', 'image/png', 5842, 0, '2026-05-17 09:05:46', '2026-05-17 09:05:46', NULL);
INSERT INTO `revision_files` VALUES (12, 43, 7, '/uploads/revisions/32_43_20260517125247810614_CSI3207_Assignment_2_Instructions_and_Rubric_v1.1_(1).docx', 'CSI3207 Assignment 2 Instructions and Rubric v1.1 (1).docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 97328, 0, '2026-05-17 12:52:47', '2026-05-17 12:52:47', NULL);
INSERT INTO `revision_files` VALUES (13, 43, 7, '/uploads/revisions/32_43_20260517125247815114_34_20260515010049_1.docx', '34_20260515010049_1.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 23380, 0, '2026-05-17 12:52:47', '2026-05-17 12:52:47', NULL);
INSERT INTO `revision_files` VALUES (14, 44, 7, '/uploads/revisions/32_44_20260517125346960092_leave-flow1-workflow_(1).json', 'leave-flow1-workflow (1).json', 'application/json', 4269, 0, '2026-05-17 12:53:46', '2026-05-17 12:53:46', NULL);
INSERT INTO `revision_files` VALUES (15, 45, 7, '/uploads/revisions/33_45_20260518231350256546_downloaded_file.json', 'downloaded_file.json', 'application/json', 96, 0, '2026-05-18 23:13:50', '2026-05-18 23:13:50', NULL);

-- ----------------------------
-- Table structure for revision_request_files
-- ----------------------------
DROP TABLE IF EXISTS `revision_request_files`;
CREATE TABLE `revision_request_files`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `revision_request_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  `uploaded_by_user_id` bigint NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `file_size` bigint NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `revision_request_id`(`revision_request_id` ASC) USING BTREE,
  INDEX `order_id`(`order_id` ASC) USING BTREE,
  INDEX `uploaded_by_user_id`(`uploaded_by_user_id` ASC) USING BTREE,
  CONSTRAINT `revision_request_files_ibfk_1` FOREIGN KEY (`revision_request_id`) REFERENCES `task_revisions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `revision_request_files_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `tasks` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `revision_request_files_ibfk_3` FOREIGN KEY (`uploaded_by_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of revision_request_files
-- ----------------------------

-- ----------------------------
-- Table structure for revision_response_files
-- ----------------------------
DROP TABLE IF EXISTS `revision_response_files`;
CREATE TABLE `revision_response_files`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `revision_request_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  `uploaded_by_writer_id` bigint NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `file_size` bigint NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `revision_request_id`(`revision_request_id` ASC) USING BTREE,
  INDEX `order_id`(`order_id` ASC) USING BTREE,
  INDEX `uploaded_by_writer_id`(`uploaded_by_writer_id` ASC) USING BTREE,
  CONSTRAINT `revision_response_files_ibfk_1` FOREIGN KEY (`revision_request_id`) REFERENCES `task_revisions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `revision_response_files_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `tasks` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `revision_response_files_ibfk_3` FOREIGN KEY (`uploaded_by_writer_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of revision_response_files
-- ----------------------------

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `role_name`(`role_name` ASC) USING BTREE,
  INDEX `ix_roles_id`(`id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, 'SUPER_ADMIN', NULL, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `roles` VALUES (2, 'ADMIN', NULL, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `roles` VALUES (3, 'CUSTOMER', NULL, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `roles` VALUES (4, 'WRITER', NULL, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);

-- ----------------------------
-- Table structure for specializations
-- ----------------------------
DROP TABLE IF EXISTS `specializations`;
CREATE TABLE `specializations`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `academic_category_id` bigint NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `display_order` int NULL DEFAULT NULL,
  `is_active` tinyint(1) NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `academic_category_id`(`academic_category_id` ASC) USING BTREE,
  CONSTRAINT `specializations_ibfk_1` FOREIGN KEY (`academic_category_id`) REFERENCES `academic_categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of specializations
-- ----------------------------
INSERT INTO `specializations` VALUES (1, 1, 'Software Engineering', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (2, 1, 'Data Science', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (3, 1, 'Cyber Security', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (4, 1, 'Networking', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (5, 2, 'Finance', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (6, 2, 'Marketing', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (7, 2, 'Human Resources', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (8, 2, 'Accounting', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (9, 3, 'Civil Engineering', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (10, 3, 'Mechanical Engineering', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (11, 3, 'Electrical Engineering', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (12, 4, 'Nursing', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (13, 4, 'Pharmacy', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (14, 4, 'Public Health', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (15, 5, 'Psychology', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (16, 5, 'Sociology', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (17, 5, 'Political Science', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (18, 6, 'History', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (19, 6, 'Literature', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);
INSERT INTO `specializations` VALUES (20, 6, 'Philosophy', NULL, 0, 1, 0, '2026-04-24 11:11:02', '2026-04-24 11:11:02', NULL);

-- ----------------------------
-- Table structure for submission_files
-- ----------------------------
DROP TABLE IF EXISTS `submission_files`;
CREATE TABLE `submission_files`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `submission_id` bigint NOT NULL,
  `file_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mime_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `file_size` bigint NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `submission_id`(`submission_id` ASC) USING BTREE,
  CONSTRAINT `submission_files_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `task_submissions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of submission_files
-- ----------------------------
INSERT INTO `submission_files` VALUES (1, 9, '/uploads/submissions/34_9_20260517085741277533_Screenshot_2026-01-13_165653.png', 'Screenshot 2026-01-13 165653.png', 'image/png', 110160, 0, '2026-05-17 08:57:41', '2026-05-17 08:57:41', NULL);
INSERT INTO `submission_files` VALUES (2, 10, '/uploads/submissions/34_10_20260517085845031881_Screenshot_2026-01-13_160945.png', 'Screenshot 2026-01-13 160945.png', 'image/png', 129012, 0, '2026-05-17 08:58:45', '2026-05-17 08:58:45', NULL);
INSERT INTO `submission_files` VALUES (3, 13, '/uploads/submissions/32_13_20260517125205655064_33_20260515003934_RL_Examplar_80.docx', '33_20260515003934_RL_Examplar_80.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 2216523, 0, '2026-05-17 12:52:05', '2026-05-17 12:52:05', NULL);
INSERT INTO `submission_files` VALUES (4, 13, '/uploads/submissions/32_13_20260517125205662188_33_20260514235812_1.docx', '33_20260514235812_1.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 23380, 0, '2026-05-17 12:52:05', '2026-05-17 12:52:05', NULL);
INSERT INTO `submission_files` VALUES (5, 14, '/uploads/submissions/32_14_20260517125422728412_33_20260515003934_RL_Examplar_80.docx', '33_20260515003934_RL_Examplar_80.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 2216523, 0, '2026-05-17 12:54:22', '2026-05-17 12:54:22', NULL);
INSERT INTO `submission_files` VALUES (6, 14, '/uploads/submissions/32_14_20260517125422864344_33_20260514235812_1.docx', '33_20260514235812_1.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 23380, 0, '2026-05-17 12:54:22', '2026-05-17 12:54:22', NULL);
INSERT INTO `submission_files` VALUES (7, 15, '/uploads/submissions/33_15_20260524204350450609_overtime_payments_2026_05.xlsx', 'overtime_payments_2026_05.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 4964, 0, '2026-05-24 20:43:50', '2026-05-24 20:43:50', NULL);
INSERT INTO `submission_files` VALUES (8, 16, '/uploads/submissions/33_16_20260524204504151523_overtime_payments_2026_05.xlsx', 'overtime_payments_2026_05.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 4964, 0, '2026-05-24 20:45:04', '2026-05-24 20:45:04', NULL);
INSERT INTO `submission_files` VALUES (9, 16, '/uploads/submissions/33_16_20260524204504153323_Screenshot_2026-05-22_at_16.53.18.png', 'Screenshot 2026-05-22 at 16.53.18.png', 'image/png', 620816, 0, '2026-05-24 20:45:04', '2026-05-24 20:45:04', NULL);
INSERT INTO `submission_files` VALUES (10, 18, '/uploads/submissions/37_18_20260606213547398517_Attendance_report_Jun_2026_(3).pdf', 'Attendance_report_Jun_2026 (3).pdf', 'application/pdf', 594922, 0, '2026-06-06 21:35:47', '2026-06-06 21:35:47', NULL);

-- ----------------------------
-- Table structure for support_ticket_replies
-- ----------------------------
DROP TABLE IF EXISTS `support_ticket_replies`;
CREATE TABLE `support_ticket_replies`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ticket_id`(`ticket_id` ASC) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `support_ticket_replies_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `support_ticket_replies_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of support_ticket_replies
-- ----------------------------
INSERT INTO `support_ticket_replies` VALUES (1, 2, 9, 'krvknrkmv kmod o', 1, 0, '2026-06-07 01:04:45', '2026-06-07 01:04:45', NULL);

-- ----------------------------
-- Table structure for support_tickets
-- ----------------------------
DROP TABLE IF EXISTS `support_tickets`;
CREATE TABLE `support_tickets`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ticket_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` bigint NOT NULL,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `ticket_number`(`ticket_number` ASC) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `support_tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of support_tickets
-- ----------------------------
INSERT INTO `support_tickets` VALUES (1, 'TKT-0001', 7, 'pkmfpmregegeg', 'pjeijtiojtijtijtitit', 'IN_PROGRESS', 0, '2026-06-07 01:03:55', '2026-06-07 01:06:11', NULL);
INSERT INTO `support_tickets` VALUES (2, 'TKT-0002', 7, 'lkmrtgpkmrgbpmrbg', 'oknsvkm lnokmr momr l', 'CLOSED', 0, '2026-06-07 01:04:27', '2026-06-07 01:05:36', NULL);

-- ----------------------------
-- Table structure for task_assignments
-- ----------------------------
DROP TABLE IF EXISTS `task_assignments`;
CREATE TABLE `task_assignments`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `task_id` bigint NOT NULL,
  `writer_id` bigint NOT NULL,
  `assigned_by_admin_id` bigint NULL DEFAULT NULL,
  `assignment_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `assigned_at` datetime NULL DEFAULT NULL,
  `accepted_at` datetime NULL DEFAULT NULL,
  `rejected_at` datetime NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `task_id`(`task_id` ASC) USING BTREE,
  INDEX `writer_id`(`writer_id` ASC) USING BTREE,
  INDEX `assigned_by_admin_id`(`assigned_by_admin_id` ASC) USING BTREE,
  CONSTRAINT `task_assignments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `task_assignments_ibfk_2` FOREIGN KEY (`writer_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `task_assignments_ibfk_3` FOREIGN KEY (`assigned_by_admin_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of task_assignments
-- ----------------------------
INSERT INTO `task_assignments` VALUES (1, 18, 6, NULL, 'ACCEPTED', '2026-05-01 17:44:44', '2026-05-01 17:44:44', NULL, 0, '2026-05-01 17:44:43', '2026-05-01 17:44:43', NULL);
INSERT INTO `task_assignments` VALUES (2, 20, 6, NULL, 'ACCEPTED', '2026-05-02 09:40:20', '2026-05-02 09:40:20', NULL, 0, '2026-05-02 09:40:20', '2026-05-02 09:40:20', NULL);
INSERT INTO `task_assignments` VALUES (3, 21, 8, NULL, 'ACCEPTED', '2026-05-02 22:28:39', '2026-05-02 22:28:39', NULL, 0, '2026-05-02 22:28:39', '2026-05-02 22:28:39', NULL);
INSERT INTO `task_assignments` VALUES (4, 28, 8, NULL, 'ACCEPTED', '2026-05-03 13:53:43', '2026-05-03 13:53:43', NULL, 0, '2026-05-03 13:53:42', '2026-05-03 13:53:42', NULL);
INSERT INTO `task_assignments` VALUES (5, 29, 8, NULL, 'ACCEPTED', '2026-05-03 14:00:42', '2026-05-03 14:00:42', NULL, 0, '2026-05-03 14:00:42', '2026-05-03 14:00:42', NULL);
INSERT INTO `task_assignments` VALUES (6, 30, 8, NULL, 'ACCEPTED', '2026-05-03 23:57:50', '2026-05-03 23:57:50', NULL, 0, '2026-05-03 23:57:50', '2026-05-03 23:57:50', NULL);
INSERT INTO `task_assignments` VALUES (7, 33, 8, NULL, 'ACCEPTED', '2026-05-15 00:26:00', '2026-05-15 00:26:00', NULL, 0, '2026-05-15 00:25:59', '2026-05-15 00:25:59', NULL);
INSERT INTO `task_assignments` VALUES (8, 34, 8, NULL, 'ACCEPTED', '2026-05-15 01:05:24', '2026-05-15 01:05:24', NULL, 0, '2026-05-15 01:05:23', '2026-05-15 01:05:23', NULL);
INSERT INTO `task_assignments` VALUES (9, 32, 8, NULL, 'ACCEPTED', '2026-05-17 12:50:48', '2026-05-17 12:50:48', NULL, 0, '2026-05-17 12:50:48', '2026-05-17 12:50:48', NULL);
INSERT INTO `task_assignments` VALUES (10, 35, 8, NULL, 'ACCEPTED', '2026-05-24 20:31:24', '2026-05-24 20:31:24', NULL, 0, '2026-05-24 20:31:23', '2026-05-24 20:31:23', NULL);
INSERT INTO `task_assignments` VALUES (11, 27, 8, NULL, 'ACCEPTED', '2026-05-24 20:37:05', '2026-05-24 20:37:05', NULL, 0, '2026-05-24 20:37:04', '2026-05-24 20:37:04', NULL);
INSERT INTO `task_assignments` VALUES (12, 37, 8, NULL, 'ACCEPTED', '2026-06-06 21:33:40', '2026-06-06 21:33:40', NULL, 0, '2026-06-06 21:33:39', '2026-06-06 21:33:39', NULL);

-- ----------------------------
-- Table structure for task_bids
-- ----------------------------
DROP TABLE IF EXISTS `task_bids`;
CREATE TABLE `task_bids`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `task_id` bigint NOT NULL,
  `writer_id` bigint NOT NULL,
  `bid_amount` decimal(10, 2) NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `bid_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `task_id`(`task_id` ASC) USING BTREE,
  INDEX `writer_id`(`writer_id` ASC) USING BTREE,
  CONSTRAINT `task_bids_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `task_bids_ibfk_2` FOREIGN KEY (`writer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of task_bids
-- ----------------------------
INSERT INTO `task_bids` VALUES (1, 1, 5, 12.00, 'cdc', 'PENDING', '2026-04-25 16:08:12', '2026-04-25 16:08:12');
INSERT INTO `task_bids` VALUES (2, 8, 4, 122.00, '\'ljh\'oh oih\' oih', 'ACCEPTED', '2026-04-25 16:32:26', '2026-04-25 16:32:42');
INSERT INTO `task_bids` VALUES (3, 5, 5, 120.00, 'ljhl lhl lgl lgkjhcsfdhjjfxfdytt,jhnbvcz;lkjhgfdfoiuytr/vcx vcbdxffhghgusswehnkiihhgh zwx7mblop9r32v njofvhbdrjoffskbvi', 'ACCEPTED', '2026-04-25 16:41:10', '2026-04-25 16:41:25');
INSERT INTO `task_bids` VALUES (4, 10, 4, 200000.02, 'jhfluhfl iugluyg i;iu;iu', 'ACCEPTED', '2026-04-25 16:45:11', '2026-04-25 16:46:04');
INSERT INTO `task_bids` VALUES (5, 9, 6, 123.00, 'dddd', 'PENDING', '2026-04-26 21:35:03', '2026-04-26 21:35:03');
INSERT INTO `task_bids` VALUES (6, 11, 6, 123.00, 'dhdh sgsf sfsf ', 'ACCEPTED', '2026-04-26 21:36:37', '2026-04-26 21:36:51');
INSERT INTO `task_bids` VALUES (7, 12, 6, 1234.00, 'fsf sfsf ', 'ACCEPTED', '2026-04-26 21:39:42', '2026-04-26 21:41:05');
INSERT INTO `task_bids` VALUES (8, 13, 6, 132.00, 'd', 'ACCEPTED', '2026-04-26 21:51:02', '2026-04-26 21:51:07');
INSERT INTO `task_bids` VALUES (9, 14, 6, 120.00, 'oiv omw omw ', 'PENDING', '2026-04-27 22:34:11', '2026-04-27 22:34:11');
INSERT INTO `task_bids` VALUES (10, 15, 4, 120.00, 'jn', 'ACCEPTED', '2026-04-27 22:37:08', '2026-04-27 22:37:19');
INSERT INTO `task_bids` VALUES (11, 16, 6, 120.00, 'chat kroth gana adu krnwa', 'PENDING', '2026-04-27 23:45:38', '2026-04-27 23:45:38');
INSERT INTO `task_bids` VALUES (12, 17, 6, 120.00, 'meka thma bid description eka', 'PENDING', '2026-04-27 23:58:51', '2026-04-27 23:58:51');
INSERT INTO `task_bids` VALUES (13, 18, 6, 120.00, 'Api katha krla gana ehe mehe karagamu\n', 'ACCEPTED', '2026-04-28 00:33:41', '2026-05-01 17:44:43');
INSERT INTO `task_bids` VALUES (14, 19, 6, 120.00, 'kiph\'ogh [yipug [uigpiug', 'ACCEPTED', '2026-05-01 17:04:03', '2026-05-01 17:05:05');
INSERT INTO `task_bids` VALUES (15, 20, 6, 100.00, 'onjfvson okns oijnsvj ', 'ACCEPTED', '2026-05-02 09:38:02', '2026-05-02 09:40:20');
INSERT INTO `task_bids` VALUES (16, 21, 8, 500.00, 'kino ojnw onwi onwn on ', 'ACCEPTED', '2026-05-02 22:20:49', '2026-05-02 22:28:39');
INSERT INTO `task_bids` VALUES (17, 23, 8, 12.00, 'knfm lmdfm lmdm lmd ', 'PENDING', '2026-05-03 13:07:58', '2026-05-03 13:13:18');
INSERT INTO `task_bids` VALUES (18, 24, 8, 127.00, 'wcw', 'PENDING', '2026-05-03 13:14:20', '2026-05-03 13:18:41');
INSERT INTO `task_bids` VALUES (19, 25, 8, 33.00, 'de', 'PENDING', '2026-05-03 13:20:35', '2026-05-03 13:20:35');
INSERT INTO `task_bids` VALUES (20, 26, 8, 88.00, 'pojp pknm ', 'PENDING', '2026-05-03 13:43:42', '2026-05-03 13:43:42');
INSERT INTO `task_bids` VALUES (21, 27, 8, 33.00, 'gg', 'ACCEPTED', '2026-05-03 13:47:50', '2026-05-24 20:37:04');
INSERT INTO `task_bids` VALUES (22, 28, 8, 44.00, 'g', 'ACCEPTED', '2026-05-03 13:53:09', '2026-05-03 13:53:42');
INSERT INTO `task_bids` VALUES (23, 29, 8, 87.00, 'o', 'ACCEPTED', '2026-05-03 13:58:50', '2026-05-03 14:00:42');
INSERT INTO `task_bids` VALUES (24, 30, 8, 120.00, 'e', 'ACCEPTED', '2026-05-03 23:57:28', '2026-05-03 23:57:50');
INSERT INTO `task_bids` VALUES (25, 33, 8, 34.00, 'I can do this ', 'ACCEPTED', '2026-05-15 00:05:27', '2026-05-24 23:36:35');
INSERT INTO `task_bids` VALUES (26, 34, 8, 10.00, 'fvfv ', 'ACCEPTED', '2026-05-15 01:02:07', '2026-05-15 01:05:23');
INSERT INTO `task_bids` VALUES (27, 32, 8, 20.00, 'qwer', 'ACCEPTED', '2026-05-17 12:26:15', '2026-05-17 12:50:48');
INSERT INTO `task_bids` VALUES (28, 35, 8, 12.00, 'rgegdg', 'ACCEPTED', '2026-05-24 20:11:45', '2026-05-24 20:31:23');
INSERT INTO `task_bids` VALUES (29, 37, 8, 100.00, 'seniya', 'ACCEPTED', '2026-06-06 21:31:30', '2026-06-06 21:33:39');

-- ----------------------------
-- Table structure for task_files
-- ----------------------------
DROP TABLE IF EXISTS `task_files`;
CREATE TABLE `task_files`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `task_id` bigint NOT NULL,
  `uploaded_by_user_id` bigint NOT NULL,
  `file_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mime_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `file_size` bigint NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `task_id`(`task_id` ASC) USING BTREE,
  INDEX `uploaded_by_user_id`(`uploaded_by_user_id` ASC) USING BTREE,
  CONSTRAINT `task_files_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `task_files_ibfk_2` FOREIGN KEY (`uploaded_by_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of task_files
-- ----------------------------
INSERT INTO `task_files` VALUES (1, 29, 7, 'REQUIREMENT_FILE', '/uploads/tasks/29_20260503235451_mashuma.docx', 'mashuma.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 23154, 0, '2026-05-03 23:54:51', '2026-05-03 23:54:51', NULL);
INSERT INTO `task_files` VALUES (2, 31, 7, 'REQUIREMENT_FILE', '/uploads/tasks/31_20260504001526_ChatGPT_Image_May_2,_2026,_10_46_07_AM_(1).png', 'ChatGPT Image May 2, 2026, 10_46_07 AM (1).png', 'image/png', 1182657, 0, '2026-05-04 00:15:27', '2026-05-04 00:15:27', NULL);
INSERT INTO `task_files` VALUES (3, 31, 7, 'REQUIREMENT_FILE', '/uploads/tasks/31_20260504001526_ChatGPT_Image_May_2,_2026,_10_46_07_AM.png', 'ChatGPT Image May 2, 2026, 10_46_07 AM.png', 'image/png', 1182657, 0, '2026-05-04 00:15:27', '2026-05-04 00:15:27', NULL);
INSERT INTO `task_files` VALUES (4, 31, 7, 'REQUIREMENT_FILE', '/uploads/tasks/31_20260504001526_ChatGPT_Image_May_2,_2026,_10_46_05_AM.png', 'ChatGPT Image May 2, 2026, 10_46_05 AM.png', 'image/png', 1182657, 0, '2026-05-04 00:15:27', '2026-05-04 00:15:27', NULL);
INSERT INTO `task_files` VALUES (5, 31, 7, 'REQUIREMENT_FILE', '/uploads/tasks/31_20260504001527_mashuma.docx', 'mashuma.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 23154, 0, '2026-05-04 00:15:27', '2026-05-04 00:15:27', NULL);
INSERT INTO `task_files` VALUES (6, 32, 7, 'REQUIREMENT_FILE', '/uploads/tasks/32_20260504103434_Chapter_4_2000words.docx', 'Chapter_4_2000words.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 41609, 0, '2026-05-04 10:34:34', '2026-05-04 10:34:34', NULL);
INSERT INTO `task_files` VALUES (7, 32, 7, 'REQUIREMENT_FILE', '/uploads/tasks/32_20260504103434_Chapter_3_(1).docx', 'Chapter 3 (1).docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 30978, 0, '2026-05-04 10:34:34', '2026-05-04 10:34:34', NULL);
INSERT INTO `task_files` VALUES (8, 32, 7, 'REQUIREMENT_FILE', '/uploads/tasks/32_20260504104321_Attendance_report_2026-02-02.pdf', 'Attendance_report_2026-02-02.pdf', 'application/pdf', 7415, 0, '2026-05-04 10:43:21', '2026-05-04 10:43:21', NULL);
INSERT INTO `task_files` VALUES (9, 20, 4, 'REQUIREMENT_FILE', '/uploads/tasks/20_20260510201152_Inventory.docx', 'Inventory.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 54227, 0, '2026-05-10 20:11:52', '2026-05-10 20:11:52', NULL);
INSERT INTO `task_files` VALUES (10, 30, 7, 'REQUIREMENT_FILE', '/uploads/tasks/30_20260511175214_WhatsApp_Image_2026-05-09_at_19.29.10.jpeg', 'WhatsApp Image 2026-05-09 at 19.29.10.jpeg', 'image/jpeg', 113364, 0, '2026-05-11 17:52:14', '2026-05-11 17:52:14', NULL);
INSERT INTO `task_files` VALUES (11, 33, 7, 'REQUIREMENT_FILE', '/uploads/tasks/33_20260514235812_1.docx', '1.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 23380, 0, '2026-05-14 23:58:12', '2026-05-14 23:58:12', NULL);
INSERT INTO `task_files` VALUES (12, 33, 8, 'SUBMISSION_FILE', '/uploads/tasks/33_20260515003934_RL_Examplar_80.docx', 'RL Examplar 80.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 2216523, 0, '2026-05-15 00:39:34', '2026-05-15 00:39:34', NULL);
INSERT INTO `task_files` VALUES (13, 33, 8, 'SUBMISSION_FILE', '/uploads/tasks/33_20260515003934_Semina.docx', 'Semina.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 33450, 0, '2026-05-15 00:39:34', '2026-05-15 00:39:34', NULL);
INSERT INTO `task_files` VALUES (14, 33, 8, 'SUBMISSION_FILE', '/uploads/tasks/33_20260515003934_Sustainable_Leadership_-_New_Assessment_Criteria_CSE4066_(2)_-_Tagged.pdf', 'Sustainable Leadership - New Assessment Criteria CSE4066 (2) - Tagged.pdf', 'application/pdf', 123520, 0, '2026-05-15 00:39:34', '2026-05-15 00:39:34', NULL);
INSERT INTO `task_files` VALUES (15, 33, 7, 'REQUIREMENT_FILE', '/uploads/tasks/33_20260515005123_Inventory.docx', 'Inventory.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 54227, 0, '2026-05-15 00:51:23', '2026-05-15 00:51:23', NULL);
INSERT INTO `task_files` VALUES (16, 33, 7, 'REQUIREMENT_FILE', '/uploads/tasks/33_20260515005123_OTHM-L5_-_LO-03_-__H-650-1106_-_Procurement_and_Inventory_Management.pdf', 'OTHM-L5 - LO-03 -  H-650-1106 - Procurement and Inventory Management.pdf', 'application/pdf', 720647, 0, '2026-05-15 00:51:23', '2026-05-15 00:51:23', NULL);
INSERT INTO `task_files` VALUES (17, 33, 7, 'REQUIREMENT_FILE', '/uploads/tasks/33_20260515005224_Inventory.docx', 'Inventory.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 54227, 0, '2026-05-15 00:52:24', '2026-05-15 00:52:24', NULL);
INSERT INTO `task_files` VALUES (18, 33, 7, 'REQUIREMENT_FILE', '/uploads/tasks/33_20260515005443_Muller,_Max_-_Essentials_of_Inventory_Management-AMACOM_–_Book_Division_of_American_Management_Association_(2011).pdf', 'Muller, Max - Essentials of Inventory Management-AMACOM – Book Division of American Management Association (2011).pdf', 'application/pdf', 2855231, 0, '2026-05-15 00:54:43', '2026-05-15 00:54:43', NULL);
INSERT INTO `task_files` VALUES (19, 34, 7, 'REQUIREMENT_FILE', '/uploads/tasks/34_20260515010049_1.docx', '1.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 23380, 0, '2026-05-15 01:00:49', '2026-05-15 01:00:49', NULL);
INSERT INTO `task_files` VALUES (20, 34, 7, 'REQUIREMENT_FILE', '/uploads/tasks/34_20260515010049_Inventory.docx', 'Inventory.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 54227, 0, '2026-05-15 01:00:49', '2026-05-15 01:00:49', NULL);
INSERT INTO `task_files` VALUES (21, 34, 7, 'REQUIREMENT_FILE', '/uploads/tasks/34_20260515010135_OTHM-L5_-_LO-03_-__H-650-1106_-_Procurement_and_Inventory_Management.pdf', 'OTHM-L5 - LO-03 -  H-650-1106 - Procurement and Inventory Management.pdf', 'application/pdf', 720647, 0, '2026-05-15 01:01:35', '2026-05-15 01:01:35', NULL);
INSERT INTO `task_files` VALUES (22, 34, 8, 'SUBMISSION_FILE', '/uploads/tasks/34_20260515010609_Semina.docx', 'Semina.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 33450, 0, '2026-05-15 01:06:09', '2026-05-15 01:06:09', NULL);
INSERT INTO `task_files` VALUES (23, 34, 7, 'REQUIREMENT_FILE', '/uploads/tasks/34_20260515010632_Inventory.docx', 'Inventory.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 54227, 0, '2026-05-15 01:06:32', '2026-05-15 01:06:32', NULL);
INSERT INTO `task_files` VALUES (24, 34, 8, 'SUBMISSION_FILE', '/uploads/tasks/34_20260515010655_Semina.docx', 'Semina.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 33450, 0, '2026-05-15 01:06:55', '2026-05-15 01:06:55', NULL);
INSERT INTO `task_files` VALUES (25, 34, 7, 'REQUIREMENT_FILE', '/uploads/tasks/34_20260515211315_OTHM-L5_-_LO-03_-__H-650-1106_-_Procurement_and_Inventory_Management.pdf', 'OTHM-L5 - LO-03 -  H-650-1106 - Procurement and Inventory Management.pdf', 'application/pdf', 720647, 0, '2026-05-15 21:13:15', '2026-05-15 21:13:15', NULL);
INSERT INTO `task_files` VALUES (26, 34, 7, 'REQUIREMENT_FILE', '/uploads/tasks/34_20260515211405_Screenshot_2026-01-13_151238.png', 'Screenshot 2026-01-13 151238.png', 'image/png', 221764, 0, '2026-05-15 21:14:05', '2026-05-15 21:14:05', NULL);
INSERT INTO `task_files` VALUES (27, 34, 7, 'REQUIREMENT_FILE', '/uploads/tasks/34_20260515213731_Screenshot_2026-01-13_151256.png', 'Screenshot 2026-01-13 151256.png', 'image/png', 11900, 0, '2026-05-15 21:37:31', '2026-05-15 21:37:31', NULL);
INSERT INTO `task_files` VALUES (28, 34, 8, 'SUBMISSION_FILE', '/uploads/tasks/34_20260515221444_Principles_and_Concepts_of_Strategy_-_Lecture_03.pptx.pdf', 'Principles and Concepts of Strategy - Lecture 03.pptx.pdf', 'application/pdf', 838618, 0, '2026-05-15 22:14:44', '2026-05-15 22:14:44', NULL);
INSERT INTO `task_files` VALUES (29, 34, 7, 'REVISION_INSTRUCTION_FILE', '/uploads/tasks/34_20260516195738_Screenshot_2026-01-13_164313.png', 'Screenshot 2026-01-13 164313.png', 'image/png', 93533, 0, '2026-05-16 19:57:38', '2026-05-16 19:57:38', NULL);
INSERT INTO `task_files` VALUES (30, 35, 7, 'REQUIREMENT_FILE', '/uploads/tasks/35_20260524201117_Screenshot_2026-05-22_at_16.53.18.png', 'Screenshot 2026-05-22 at 16.53.18.png', 'image/png', 620816, 0, '2026-05-24 20:11:17', '2026-05-24 20:11:17', NULL);
INSERT INTO `task_files` VALUES (31, 36, 7, 'REQUIREMENT_FILE', '/uploads/tasks/36_20260606212830_OTHM-L5_-_LO-03_-__H-650-1106_-_Procurement_and_Inventory_Management.pdf', 'OTHM-L5 - LO-03 -  H-650-1106 - Procurement and Inventory Management.pdf', 'application/pdf', 720647, 0, '2026-06-06 21:28:30', '2026-06-06 21:28:30', NULL);
INSERT INTO `task_files` VALUES (32, 37, 7, 'REQUIREMENT_FILE', '/uploads/tasks/37_20260606213058_OTHM-L5_-_LO-01_-__H-650-1106_-_Procurement_and_Inventory_Management.pdf', 'OTHM-L5 - LO-01 -  H-650-1106 - Procurement and Inventory Management.pdf', 'application/pdf', 965633, 0, '2026-06-06 21:30:58', '2026-06-06 21:30:58', NULL);

-- ----------------------------
-- Table structure for task_revisions
-- ----------------------------
DROP TABLE IF EXISTS `task_revisions`;
CREATE TABLE `task_revisions`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `task_id` bigint NOT NULL,
  `submission_id` bigint NOT NULL,
  `requested_by_user_id` bigint NOT NULL,
  `revision_note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `revision_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `requested_at` datetime NULL DEFAULT NULL,
  `completed_at` datetime NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `task_id`(`task_id` ASC) USING BTREE,
  INDEX `submission_id`(`submission_id` ASC) USING BTREE,
  INDEX `requested_by_user_id`(`requested_by_user_id` ASC) USING BTREE,
  CONSTRAINT `task_revisions_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `task_revisions_ibfk_2` FOREIGN KEY (`submission_id`) REFERENCES `task_submissions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `task_revisions_ibfk_3` FOREIGN KEY (`requested_by_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 49 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of task_revisions
-- ----------------------------
INSERT INTO `task_revisions` VALUES (37, 34, 7, 7, 'hui', 'COMPLETED', '2026-05-17 08:30:43', NULL, 0, '2026-05-17 08:30:42', '2026-05-17 08:56:54', NULL);
INSERT INTO `task_revisions` VALUES (38, 34, 7, 7, 'yui', 'COMPLETED', '2026-05-17 08:31:05', NULL, 0, '2026-05-17 08:31:05', '2026-05-17 08:56:54', NULL);
INSERT INTO `task_revisions` VALUES (39, 34, 7, 7, 'ytre', 'COMPLETED', '2026-05-17 08:31:37', NULL, 0, '2026-05-17 08:31:36', '2026-05-17 08:56:54', NULL);
INSERT INTO `task_revisions` VALUES (40, 34, 7, 7, 'kjhgf', 'COMPLETED', '2026-05-17 08:40:38', NULL, 0, '2026-05-17 08:40:38', '2026-05-17 08:56:54', NULL);
INSERT INTO `task_revisions` VALUES (41, 34, 10, 7, 'revision 2', 'COMPLETED', '2026-05-17 09:00:12', NULL, 0, '2026-05-17 09:00:12', '2026-05-17 09:25:40', NULL);
INSERT INTO `task_revisions` VALUES (42, 34, 10, 7, 'revision for notification', 'COMPLETED', '2026-05-17 09:05:47', NULL, 0, '2026-05-17 09:05:46', '2026-05-17 09:25:40', NULL);
INSERT INTO `task_revisions` VALUES (43, 32, 13, 7, 'MEKA WENAS KRLA DENNA', 'COMPLETED', '2026-05-17 12:52:48', NULL, 0, '2026-05-17 12:52:47', '2026-05-17 12:54:22', NULL);
INSERT INTO `task_revisions` VALUES (44, 32, 13, 7, 'MEKATH WENAS KARANNA', 'COMPLETED', '2026-05-17 12:53:47', NULL, 0, '2026-05-17 12:53:46', '2026-05-17 12:54:22', NULL);
INSERT INTO `task_revisions` VALUES (45, 33, 4, 7, 'meka wrdi me file eka widyata balanna', 'COMPLETED', '2026-05-18 23:13:50', NULL, 0, '2026-05-18 23:13:50', '2026-05-24 20:43:50', NULL);
INSERT INTO `task_revisions` VALUES (46, 33, 4, 7, 'popmpm', 'COMPLETED', '2026-05-24 20:43:22', NULL, 0, '2026-05-24 20:43:21', '2026-05-24 20:43:50', NULL);
INSERT INTO `task_revisions` VALUES (47, 33, 16, 7, 'mpkmpkmpmpmpm', 'COMPLETED', '2026-05-24 20:45:23', NULL, 0, '2026-05-24 20:45:23', '2026-05-24 20:45:34', NULL);
INSERT INTO `task_revisions` VALUES (48, 37, 18, 7, 'Need a revision', 'REQUESTED', '2026-06-06 21:36:31', NULL, 0, '2026-06-06 21:36:31', '2026-06-06 21:36:31', NULL);

-- ----------------------------
-- Table structure for task_submissions
-- ----------------------------
DROP TABLE IF EXISTS `task_submissions`;
CREATE TABLE `task_submissions`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `task_id` bigint NOT NULL,
  `writer_id` bigint NOT NULL,
  `submission_note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `submission_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `submitted_at` datetime NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `task_id`(`task_id` ASC) USING BTREE,
  INDEX `writer_id`(`writer_id` ASC) USING BTREE,
  CONSTRAINT `task_submissions_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `task_submissions_ibfk_2` FOREIGN KEY (`writer_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of task_submissions
-- ----------------------------
INSERT INTO `task_submissions` VALUES (1, 21, 8, ';kn', 'FINAL_SUBMISSION', '2026-05-02 22:29:46', 0, '2026-05-02 22:29:46', '2026-05-02 22:29:46', NULL);
INSERT INTO `task_submissions` VALUES (2, 33, 8, 'here is your completed task', 'FINAL_SUBMISSION', '2026-05-15 00:29:01', 0, '2026-05-15 00:29:00', '2026-05-15 00:29:00', NULL);
INSERT INTO `task_submissions` VALUES (3, 33, 8, 'here is your completed task', 'FINAL_SUBMISSION', '2026-05-15 00:29:10', 0, '2026-05-15 00:29:09', '2026-05-15 00:29:09', NULL);
INSERT INTO `task_submissions` VALUES (4, 33, 8, 'jo', 'FINAL_SUBMISSION', '2026-05-15 00:39:35', 0, '2026-05-15 00:39:35', '2026-05-15 00:39:35', NULL);
INSERT INTO `task_submissions` VALUES (5, 34, 8, 'klnlk', 'FINAL_SUBMISSION', '2026-05-15 01:06:09', 0, '2026-05-15 01:06:09', '2026-05-15 01:06:09', NULL);
INSERT INTO `task_submissions` VALUES (6, 34, 8, 'klnlk', 'FINAL_SUBMISSION', '2026-05-15 01:06:55', 0, '2026-05-15 01:06:55', '2026-05-15 01:06:55', NULL);
INSERT INTO `task_submissions` VALUES (7, 34, 8, 'jbkjbjb', 'FINAL_SUBMISSION', '2026-05-15 22:14:45', 0, '2026-05-15 22:14:44', '2026-05-15 22:14:44', NULL);
INSERT INTO `task_submissions` VALUES (8, 34, 8, 'Dear client, please find the revised and completed project files attached. I have addressed all your feedback from Request 4 carefully. Let me know if you need anything else!', 'FINAL_SUBMISSION', '2026-05-17 08:56:54', 0, '2026-05-17 08:56:54', '2026-05-17 08:56:54', NULL);
INSERT INTO `task_submissions` VALUES (9, 34, 8, 'njbkbhkhbkhfDear ', 'FINAL_SUBMISSION', '2026-05-17 08:57:41', 0, '2026-05-17 08:57:41', '2026-05-17 08:57:41', NULL);
INSERT INTO `task_submissions` VALUES (10, 34, 8, 'this is the files for the revision', 'FINAL_SUBMISSION', '2026-05-17 08:58:45', 0, '2026-05-17 08:58:45', '2026-05-17 08:58:45', NULL);
INSERT INTO `task_submissions` VALUES (11, 34, 8, 'menna mek thma anthima revision ekta file eka check this', 'FINAL_SUBMISSION', '2026-05-17 09:25:40', 0, '2026-05-17 09:25:40', '2026-05-17 09:25:40', NULL);
INSERT INTO `task_submissions` VALUES (12, 34, 8, 'menna revison', 'FINAL_SUBMISSION', '2026-05-17 09:27:50', 0, '2026-05-17 09:27:50', '2026-05-17 09:27:50', NULL);
INSERT INTO `task_submissions` VALUES (13, 32, 8, 'Finsl task', 'FINAL_SUBMISSION', '2026-05-17 12:52:06', 0, '2026-05-17 12:52:05', '2026-05-17 12:52:05', NULL);
INSERT INTO `task_submissions` VALUES (14, 32, 8, 'revision files chexk krnna', 'FINAL_SUBMISSION', '2026-05-17 12:54:23', 0, '2026-05-17 12:54:22', '2026-05-17 12:54:22', NULL);
INSERT INTO `task_submissions` VALUES (15, 33, 8, 'mnokm', 'FINAL_SUBMISSION', '2026-05-24 20:43:50', 0, '2026-05-24 20:43:50', '2026-05-24 20:43:50', NULL);
INSERT INTO `task_submissions` VALUES (16, 33, 8, 'k;km;;lmp plm', 'FINAL_SUBMISSION', '2026-05-24 20:45:04', 0, '2026-05-24 20:45:04', '2026-05-24 20:45:04', NULL);
INSERT INTO `task_submissions` VALUES (17, 33, 8, 'mpkmpk', 'FINAL_SUBMISSION', '2026-05-24 20:45:35', 0, '2026-05-24 20:45:34', '2026-05-24 20:45:34', NULL);
INSERT INTO `task_submissions` VALUES (18, 37, 8, 'isadh', 'FINAL_SUBMISSION', '2026-06-06 21:35:47', 0, '2026-06-06 21:35:47', '2026-06-06 21:35:47', NULL);

-- ----------------------------
-- Table structure for tasks
-- ----------------------------
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customer_id` bigint NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `academic_category_id` bigint NULL DEFAULT NULL,
  `specialization_id` bigint NULL DEFAULT NULL,
  `education_level_id` bigint NULL DEFAULT NULL,
  `deadline` datetime NOT NULL,
  `budget` decimal(10, 2) NULL DEFAULT NULL,
  `task_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `payment_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_urgent` tinyint(1) NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `customer_id`(`customer_id` ASC) USING BTREE,
  INDEX `academic_category_id`(`academic_category_id` ASC) USING BTREE,
  INDEX `specialization_id`(`specialization_id` ASC) USING BTREE,
  INDEX `education_level_id`(`education_level_id` ASC) USING BTREE,
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`academic_category_id`) REFERENCES `academic_categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `tasks_ibfk_3` FOREIGN KEY (`specialization_id`) REFERENCES `specializations` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `tasks_ibfk_4` FOREIGN KEY (`education_level_id`) REFERENCES `education_levels` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 39 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tasks
-- ----------------------------
INSERT INTO `tasks` VALUES (1, 3, 'rwfwr', 'rwrwrw', 3, 11, 1, '2026-04-29 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-04-25 10:47:31', '2026-04-25 10:47:31', NULL);
INSERT INTO `tasks` VALUES (2, 4, 'luholhb', 'ohohhh', 2, 7, 2, '2026-04-29 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-04-25 10:51:58', '2026-04-25 10:51:58', NULL);
INSERT INTO `tasks` VALUES (3, 4, 'kjbjbk', 'kjjbkjb', 2, 8, 1, '2026-04-29 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-04-25 10:52:29', '2026-04-25 10:52:29', NULL);
INSERT INTO `tasks` VALUES (4, 4, 'jhube', 'kmpm pmf mpmf ', 4, 12, 1, '2026-04-29 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-04-25 16:05:56', '2026-04-25 16:05:56', NULL);
INSERT INTO `tasks` VALUES (5, 5, 'sfsfsf', 'sfsfsf dbsvs sgsf seg  ', 3, 10, 1, '2026-04-28 23:59:59', 120.00, 'PENDING_PAYMENT', 'UNPAID', 0, 0, '2026-04-25 16:17:59', '2026-04-25 16:41:25', NULL);
INSERT INTO `tasks` VALUES (6, 4, 'ewffwfwf ', 'ef gfs rgt rsgg s srggeg', 2, 6, 2, '2026-04-29 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-04-25 16:29:37', '2026-04-25 16:29:37', NULL);
INSERT INTO `tasks` VALUES (7, 4, 'dfghjkl', 'yifdxoyfp ogipg igp', 1, 1, 2, '2026-04-29 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-04-25 16:30:10', '2026-04-25 16:30:10', NULL);
INSERT INTO `tasks` VALUES (8, 4, 'seniya task', ';iygipug ig;ig ug u;iug iugiuig uig;ugp puy;jh uih', 1, 1, 2, '2026-04-28 23:59:59', 122.00, 'PENDING_PAYMENT', 'UNPAID', 0, 0, '2026-04-25 16:31:56', '2026-04-25 16:32:42', NULL);
INSERT INTO `tasks` VALUES (9, 5, 'software', 'ffw qf wfwf agseg seg sgs.nku9iyyhj,n,.mop0rk', 1, 1, 2, '2026-04-29 23:59:59', NULL, 'OPEN', 'UNPAID', 1, 0, '2026-04-25 16:39:33', '2026-04-25 16:39:33', NULL);
INSERT INTO `tasks` VALUES (10, 4, 'software assignment', ';sjnvopn oksj v[oisj [oj v[sojv [osijv sp[o [ovj [ojv', 1, 1, 2, '2026-04-28 23:59:59', 200000.02, 'PENDING_PAYMENT', 'UNPAID', 1, 0, '2026-04-25 16:43:20', '2026-04-25 16:46:04', NULL);
INSERT INTO `tasks` VALUES (11, 6, 'Software Project', 'efwef wfwf wwdw wdwd ', 1, 1, 2, '2026-04-29 23:59:59', 123.00, 'PENDING_PAYMENT', 'UNPAID', 0, 0, '2026-04-26 21:35:55', '2026-04-26 21:36:51', NULL);
INSERT INTO `tasks` VALUES (12, 6, 'Software Project 2', 'sff fda ad a ', 1, 1, 1, '2026-04-29 23:59:59', 1234.00, 'PENDING_PAYMENT', 'UNPAID', 0, 0, '2026-04-26 21:39:24', '2026-04-26 21:41:05', NULL);
INSERT INTO `tasks` VALUES (13, 6, 'soft3', 'ed wdwd dqd ', 1, 2, 2, '2026-05-11 23:59:59', 132.00, 'PENDING_PAYMENT', 'UNPAID', 0, 0, '2026-04-26 21:50:48', '2026-04-26 21:51:07', NULL);
INSERT INTO `tasks` VALUES (14, 5, 'Adiwasiya project', 'kmrgt pmg pkmr ', 1, 1, 2, '2026-04-29 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-04-27 22:33:04', '2026-04-27 22:33:04', NULL);
INSERT INTO `tasks` VALUES (15, 4, 'adiwasiya 2', 'ohe ojie oije oije ', 1, 1, 2, '2026-04-30 23:59:59', 120.00, 'PENDING_PAYMENT', 'UNPAID', 0, 0, '2026-04-27 22:36:53', '2026-04-27 22:37:19', NULL);
INSERT INTO `tasks` VALUES (16, 4, 'Lets chat task', 'inind inond innd nond ', 1, 1, 1, '2026-04-30 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-04-27 23:45:17', '2026-04-27 23:45:17', NULL);
INSERT INTO `tasks` VALUES (17, 4, 'Meka thma title eka', 'Meka thma Description eka', 1, 1, 2, '2026-04-29 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-04-27 23:58:21', '2026-04-27 23:58:21', NULL);
INSERT INTO `tasks` VALUES (18, 4, 'Adiwasiya Project 2', 'meka karala dipan', 1, 1, 2, '2026-04-30 23:59:59', 120.00, 'PENDING_PAYMENT', 'UNPAID', 0, 0, '2026-04-28 00:33:16', '2026-05-01 17:44:43', NULL);
INSERT INTO `tasks` VALUES (19, 4, 'Senadhi Project 3333', 'meka hriyata karala dipan', 1, 1, 2, '2026-05-26 23:59:59', 120.00, 'PENDING_PAYMENT', 'UNPAID', 0, 0, '2026-05-01 17:01:43', '2026-05-01 17:05:05', NULL);
INSERT INTO `tasks` VALUES (20, 4, 'Udantha Assignment Software ', 'meka hriytsaa krla denna\n', 1, 1, 2, '2026-05-20 23:59:59', 100.00, 'PENDING_PAYMENT', 'UNPAID', 0, 0, '2026-05-02 09:36:58', '2026-05-02 09:40:20', NULL);
INSERT INTO `tasks` VALUES (21, 7, 'Software ENginerr Assignment by dulshika', 'meka hriyata krla ona', 1, 1, 2, '2026-05-20 23:59:59', 500.00, 'SUBMITTED', 'UNPAID', 0, 0, '2026-05-02 22:19:15', '2026-05-02 22:29:46', NULL);
INSERT INTO `tasks` VALUES (22, 7, 'dinois', 'poms mf kmf pkmf knf ', 3, 10, 2, '2026-05-19 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-05-03 10:38:27', '2026-05-03 10:38:27', NULL);
INSERT INTO `tasks` VALUES (23, 7, 'Software 2 by Dulshika', 'ojd ojm ojd ojd ojd', 1, 1, 3, '2026-05-19 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-05-03 13:07:28', '2026-05-03 13:07:28', NULL);
INSERT INTO `tasks` VALUES (24, 7, 'ceefc', 'vev ;mf lr pr rpk fep ', 1, 1, 2, '2026-05-14 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-05-03 13:14:02', '2026-05-03 13:14:02', NULL);
INSERT INTO `tasks` VALUES (25, 7, 'Task 3', 'dlmd lm ;m, dcsc lmld ', 1, 1, 2, '2026-05-13 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-05-03 13:20:18', '2026-05-03 13:20:18', NULL);
INSERT INTO `tasks` VALUES (26, 7, 'Assignment 3', 'lmpom pnpkn pnkpkn pkmpm ', 1, 1, 1, '2026-05-20 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-05-03 13:22:09', '2026-05-03 13:22:09', NULL);
INSERT INTO `tasks` VALUES (27, 7, 'test lojb on ', 'oihou ojbo ojn on ', 1, 1, 2, '2026-05-14 23:59:59', 33.00, 'PENDING_PAYMENT', 'UNPAID', 0, 0, '2026-05-03 13:43:24', '2026-05-24 20:37:04', NULL);
INSERT INTO `tasks` VALUES (28, 7, 'plmp pk r pkmr', 'kmp pkm  pm  pm ', 1, 1, 2, '2026-05-05 23:59:59', 44.00, 'PENDING_PAYMENT', 'UNPAID', 0, 0, '2026-05-03 13:52:53', '2026-05-03 13:53:42', NULL);
INSERT INTO `tasks` VALUES (29, 7, 'lknpkn pknpm pmpm ', 'lknlk kmp;km k;mm lklkm ', 1, 1, 2, '2026-05-13 23:59:59', 87.00, 'PENDING_PAYMENT', 'UNPAID', 0, 0, '2026-05-03 13:58:28', '2026-05-03 14:00:42', NULL);
INSERT INTO `tasks` VALUES (30, 7, 'New task with file uload', 'newtask with uploaded mashum file', 1, 1, 2, '2026-05-14 23:59:59', 120.00, 'PENDING_PAYMENT', 'UNPAID', 0, 0, '2026-05-03 23:57:14', '2026-05-03 23:57:50', NULL);
INSERT INTO `tasks` VALUES (31, 7, 'task 2 with files', 'guu lb oih oh oih ;g ;ig ;ug', 1, 1, 2, '2026-05-21 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-05-03 23:58:28', '2026-05-03 23:58:28', NULL);
INSERT INTO `tasks` VALUES (32, 7, 'Task 4 with files', 'gg egeg  rgrg rgrg rgr', 1, 1, 2, '2026-05-12 23:59:59', 20.00, 'COMPLETED', 'UNPAID', 0, 0, '2026-05-04 10:34:34', '2026-05-17 12:54:41', NULL);
INSERT INTO `tasks` VALUES (33, 7, 'New Assignment 33', 'Can you do this', 1, 1, 1, '2026-05-15 23:59:59', 34.00, 'SUBMITTED', 'UNPAID', 0, 0, '2026-05-14 23:58:11', '2026-05-24 23:36:35', NULL);
INSERT INTO `tasks` VALUES (34, 7, 'Madhawa Task 1', 'Software project', 1, 1, 2, '2026-05-21 23:59:59', 10.00, 'COMPLETED', 'PAID', 0, 0, '2026-05-15 01:00:49', '2026-05-17 09:59:06', NULL);
INSERT INTO `tasks` VALUES (35, 7, 'Change bit checking task', 'sefg xdgdgbddhb bddb ', 1, 1, 2, '2026-06-03 23:59:59', 12.00, 'PENDING_PAYMENT', 'UNPAID', 0, 0, '2026-05-24 20:11:16', '2026-05-24 20:31:23', NULL);
INSERT INTO `tasks` VALUES (36, 7, 'business management', 'business assignment test', 2, 6, 2, '2026-06-16 23:59:59', NULL, 'OPEN', 'UNPAID', 1, 0, '2026-06-06 21:28:30', '2026-06-06 21:28:30', NULL);
INSERT INTO `tasks` VALUES (37, 7, 'Software Assignment', 'Software Assignment test', 1, 1, 1, '2026-06-18 23:59:59', 100.00, 'COMPLETED', 'UNPAID', 1, 0, '2026-06-06 21:30:58', '2026-06-06 21:38:26', NULL);
INSERT INTO `tasks` VALUES (38, 7, 'fbdbfbdbdbdb', 'fbfbffbbdbdbdbdbdbdbd', 2, 5, 1, '2026-06-19 23:59:59', NULL, 'OPEN', 'UNPAID', 0, 0, '2026-06-07 00:06:53', '2026-06-07 00:06:53', NULL);

-- ----------------------------
-- Table structure for user_profiles
-- ----------------------------
DROP TABLE IF EXISTS `user_profiles`;
CREATE TABLE `user_profiles`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `phone_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `profile_image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `university` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `course` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_profiles
-- ----------------------------
INSERT INTO `user_profiles` VALUES (1, 7, NULL, '0777777777', '/uploads/profiles/profile_7.jpg', NULL, NULL, NULL, '2026-05-16 07:41:30', '2026-05-16 07:41:30');
INSERT INTO `user_profiles` VALUES (2, 8, NULL, NULL, '/uploads/profiles/profile_8.png', NULL, NULL, NULL, '2026-05-16 07:41:49', '2026-05-16 07:41:49');

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `role_id`(`role_id` ASC) USING BTREE,
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_roles
-- ----------------------------
INSERT INTO `user_roles` VALUES (1, 1, 3, '2026-04-24 17:26:19');
INSERT INTO `user_roles` VALUES (3, 3, 3, '2026-04-25 09:04:39');
INSERT INTO `user_roles` VALUES (4, 4, 3, '2026-04-25 10:49:58');
INSERT INTO `user_roles` VALUES (5, 5, 4, '2026-04-25 10:56:53');
INSERT INTO `user_roles` VALUES (6, 6, 4, '2026-04-25 16:19:46');
INSERT INTO `user_roles` VALUES (7, 7, 3, '2026-05-02 22:13:29');
INSERT INTO `user_roles` VALUES (8, 8, 4, '2026-05-02 22:17:03');
INSERT INTO `user_roles` VALUES (9, 9, 1, '2026-05-25 08:31:16');
INSERT INTO `user_roles` VALUES (10, 10, 4, '2026-06-07 00:02:06');
INSERT INTO `user_roles` VALUES (11, 11, 4, '2026-06-07 00:14:29');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mobile_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `whatsapp_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `role_id` bigint NULL DEFAULT NULL,
  `is_email_verified` tinyint(1) NOT NULL,
  `is_mobile_verified` tinyint(1) NOT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `verification_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `verification_code_expires_at` datetime NULL DEFAULT NULL,
  `reset_password_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `reset_password_expires_at` datetime NULL DEFAULT NULL,
  `last_login_at` datetime NULL DEFAULT NULL,
  `created_by` bigint NULL DEFAULT NULL,
  `updated_by` bigint NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uuid`(`uuid` ASC) USING BTREE,
  UNIQUE INDEX `ix_users_email`(`email` ASC) USING BTREE,
  UNIQUE INDEX `ix_users_username`(`username` ASC) USING BTREE,
  INDEX `role_id`(`role_id` ASC) USING BTREE,
  INDEX `ix_users_id`(`id` ASC) USING BTREE,
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'c6e8cd18-9185-4082-ab08-3f270bd5d9c6', 'Customer', 'User', 'customer_test@example.com', 'customer_test@example.com', '$argon2id$v=19$m=65536,t=3,p=4$4spVQJKq3Jl4YDfU+qy2Dg$byq0rSEME4GMstYhllc8xqGE4P5B5JFjnPr67PY3bqc', '0771234567', '0771234567', 3, 1, 0, 'PENDING', '257191', '2026-04-24 17:41:18', NULL, NULL, NULL, NULL, NULL, 0, '2026-04-24 17:26:19', '2026-04-24 17:26:19', NULL);
INSERT INTO `users` VALUES (3, 'd10361ba-2e11-4cf1-a486-430ebd07587c', 'Senadhi', 'Nipun', 'senadhinipun@gmail.com', 'senadhinipun@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$uvYCQOCkfUGAZz6PdtndWw$YUSltqroqCB0NZ0L2jGPGY66erVMT8uza2X/RogeWCM', '0771234567', '0771234567', 3, 1, 0, 'ACTIVE', NULL, NULL, NULL, NULL, '2026-05-11 16:26:15', NULL, NULL, 0, '2026-04-25 09:04:39', '2026-05-11 16:26:15', NULL);
INSERT INTO `users` VALUES (4, '72d05e9f-7106-4cbe-ac1c-f28570010a77', 'senadj', 'kjbk', 'sen@gmail.com', 'sen@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$NcvDFBVssbbk1sUefUbQlA$qIsST/d0E+2iUV1sX4PuKWGziRfwWZNFWuvYLrwprIs', '0999999995', '0999999995', 3, 1, 0, 'ACTIVE', NULL, NULL, NULL, NULL, '2026-05-13 22:28:31', NULL, NULL, 0, '2026-04-25 10:49:58', '2026-05-13 22:28:31', NULL);
INSERT INTO `users` VALUES (5, '5404a059-c4af-4a63-8298-823b9e71ed1f', 'Senadhi', 'Rajarathna', 'sena@gmail.com', 'sena@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$4spVQJKq3Jl4YDfU+qy2Dg$byq0rSEME4GMstYhllc8xqGE4P5B5JFjnPr67PY3bqc', '0768914716', '0768914716', 4, 1, 0, 'SUSPENDED', NULL, NULL, NULL, NULL, '2026-05-02 09:45:56', NULL, NULL, 0, '2026-04-25 10:56:53', '2026-06-04 23:32:56', NULL);
INSERT INTO `users` VALUES (6, '97f74e71-f63f-4291-a9c7-1593636ec436', 'Senadhi', 'Rajarathna', 'senad@gmail.com', 'senad@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$GJdmF6sB/2/NXzoppzdnow$HrGwJ6efBnYlZ2tJ9NVlD+yDcZZ2+quE21eClpfOTBI', '0768914716', '0768914716', 4, 1, 0, 'SUSPENDED', NULL, NULL, NULL, NULL, '2026-05-11 16:27:27', NULL, NULL, 0, '2026-04-25 16:19:46', '2026-06-04 23:32:54', NULL);
INSERT INTO `users` VALUES (7, 'df2c716a-97e5-44b4-93af-444d4b9bab55', 'Dulshika', 'Harindi', 'dulshika@gmail.com', 'dulshika@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$LjBdSCCnCNklV/wSwyHhIw$YLwxwjgcN+qqhRkChFDIdQM4rDyKFVT19xsicNQTIu4', '0777777777', '0777777777', 3, 1, 0, 'ACTIVE', NULL, NULL, NULL, NULL, '2026-06-07 00:32:31', NULL, NULL, 0, '2026-05-02 22:13:29', '2026-06-07 00:32:30', NULL);
INSERT INTO `users` VALUES (8, 'd2fa4c17-66db-464d-8410-3f724d77c112', 'Seniya', 'Rajarathna', 'seniya@gmail.com', 'seniya@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$cmXqp01ubVYnW0dQYQtP9Q$6PVJNMcAWiY6d5QZQUZLVRguu6yUnO/hiG9l3zQDYCE', '', '0777777777', 4, 1, 0, 'ACTIVE', NULL, NULL, NULL, NULL, '2026-06-06 21:20:43', NULL, NULL, 0, '2026-05-02 22:17:03', '2026-06-07 00:39:32', NULL);
INSERT INTO `users` VALUES (9, '3c32a9fc-2308-4846-a9a5-e1d66edc238b', 'Super', 'Admin', 'admin@projecthub.com', 'admin@projecthub.com', '$argon2id$v=19$m=65536,t=3,p=4$wZGsggyiFQCvB/Zeq8WKcg$BLPLq+oiLiupSxnl9iU3GV/w571uUWiSSPvRfngtB9c', NULL, NULL, 1, 1, 0, 'ACTIVE', NULL, NULL, NULL, NULL, '2026-06-06 22:05:34', NULL, NULL, 0, '2026-05-25 08:31:16', '2026-06-06 22:05:33', NULL);
INSERT INTO `users` VALUES (10, '005a8cf2-dcd0-4ef3-bf2b-2d946c736caf', 'Subashi', 'Rajarathna', 'subashi@gmail.com', 'subashi@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$pTob3B8PzkTyhGkluUjWkQ$zU9ro29Ov1R/F4sTxVyd1MRC5K5D5rYIsnKnuwTPZO0', '0773332233', '0773332233', 4, 1, 0, 'ACTIVE', NULL, NULL, NULL, NULL, '2026-06-07 00:03:45', NULL, NULL, 0, '2026-06-07 00:02:06', '2026-06-07 00:12:30', NULL);
INSERT INTO `users` VALUES (11, 'a037098a-5695-4dce-b128-0dc02dd6b777', 'Hasith', 'Randula', 'hasith@gmail.com', 'hasith@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$ELl1s4QRzoZ3o+kSqnBgsw$FIJG7SLqKv674T3basb0do+UZorAAzbIKZAYQlcwrfM', '0776567655', '0776567655', 4, 1, 0, 'ACTIVE', NULL, NULL, NULL, NULL, '2026-06-07 00:26:30', NULL, NULL, 0, '2026-06-07 00:14:29', '2026-06-07 00:26:29', NULL);

-- ----------------------------
-- Table structure for writer_documents
-- ----------------------------
DROP TABLE IF EXISTS `writer_documents`;
CREATE TABLE `writer_documents`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `writer_profile_id` bigint NOT NULL,
  `document_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mime_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `writer_profile_id`(`writer_profile_id` ASC) USING BTREE,
  CONSTRAINT `writer_documents_ibfk_1` FOREIGN KEY (`writer_profile_id`) REFERENCES `writer_profiles` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of writer_documents
-- ----------------------------

-- ----------------------------
-- Table structure for writer_fields
-- ----------------------------
DROP TABLE IF EXISTS `writer_fields`;
CREATE TABLE `writer_fields`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `writer_user_id` bigint NOT NULL,
  `field_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `writer_user_id`(`writer_user_id` ASC) USING BTREE,
  INDEX `field_id`(`field_id` ASC) USING BTREE,
  CONSTRAINT `writer_fields_ibfk_1` FOREIGN KEY (`writer_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `writer_fields_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of writer_fields
-- ----------------------------

-- ----------------------------
-- Table structure for writer_profiles
-- ----------------------------
DROP TABLE IF EXISTS `writer_profiles`;
CREATE TABLE `writer_profiles`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `education_level_id` bigint NULL DEFAULT NULL,
  `institution_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `academic_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `academic_category_id` bigint NULL DEFAULT NULL,
  `specialization_id` bigint NULL DEFAULT NULL,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `experience_years` int NULL DEFAULT NULL,
  `profile_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `education_level_id`(`education_level_id` ASC) USING BTREE,
  INDEX `academic_category_id`(`academic_category_id` ASC) USING BTREE,
  INDEX `specialization_id`(`specialization_id` ASC) USING BTREE,
  CONSTRAINT `writer_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `writer_profiles_ibfk_2` FOREIGN KEY (`education_level_id`) REFERENCES `education_levels` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `writer_profiles_ibfk_3` FOREIGN KEY (`academic_category_id`) REFERENCES `academic_categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `writer_profiles_ibfk_4` FOREIGN KEY (`specialization_id`) REFERENCES `specializations` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of writer_profiles
-- ----------------------------
INSERT INTO `writer_profiles` VALUES (1, 5, 3, 'lblnln', 'COMPLETED', 3, 9, 'kurunegala', 'Sri Lanka', 'kjb;kjb;kjb /kb\'kjn', 0, 'INCOMPLETE', 0, '2026-04-25 10:56:53', '2026-04-25 10:56:53', NULL);
INSERT INTO `writer_profiles` VALUES (2, 6, 1, 'sadadadx', 'COMPLETED', 1, 1, 'kurunegala', 'Sri Lanka', 'scsc wfwdf wd ', 0, 'INCOMPLETE', 0, '2026-04-25 16:19:46', '2026-04-25 16:19:46', NULL);
INSERT INTO `writer_profiles` VALUES (3, 8, 3, 'University of Colombo', 'Master\'s Degree', 1, 1, '', '', 'I am a proffessional writer with 5 years experience and love to work with you.', 0, 'INCOMPLETE', 0, '2026-05-02 22:17:03', '2026-05-17 10:52:34', NULL);
INSERT INTO `writer_profiles` VALUES (4, 10, 3, 'Kothalawala Defence University', 'COMPLETED', 2, 5, 'Kurunegala', 'Sri Lanka', 'I am a professional writer with 5 yeas experienve and this Bio is written by Senadhi', 0, 'REJECTED', 0, '2026-06-07 00:02:06', '2026-06-07 00:04:13', NULL);
INSERT INTO `writer_profiles` VALUES (5, 11, 3, 'Open University', 'COMPLETED', 1, 1, 'K', '', 'ohve uhf pwufh ipuwh fowhf ', 0, 'APPROVED', 0, '2026-06-07 00:14:29', '2026-06-07 00:25:57', NULL);

-- ----------------------------
-- Table structure for writer_qualifications
-- ----------------------------
DROP TABLE IF EXISTS `writer_qualifications`;
CREATE TABLE `writer_qualifications`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `writer_profile_id` bigint NOT NULL,
  `qualification_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `writer_profile_id`(`writer_profile_id` ASC) USING BTREE,
  CONSTRAINT `writer_qualifications_ibfk_1` FOREIGN KEY (`writer_profile_id`) REFERENCES `writer_profiles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of writer_qualifications
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
