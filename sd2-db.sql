-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 28, 2026 at 11:21 PM
-- Server version: 9.6.0
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `Account`
--

CREATE TABLE `Account` (
  `AccountID` int NOT NULL,
  `username` varchar(100) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Account`
--

INSERT INTO `Account` (`AccountID`, `username`, `Email`, `PasswordHash`, `CreatedAt`) VALUES
(1, 'dabielm10', 'obafemitobi07@gmail.com', '$2b$10$0ZYXBkhTPS6sGc6QXI2q/.4fjOHnqxnc752GsKLc9.6fRNn3LjHjK', '2026-03-25 01:50:12'),
(2, 'rani', 'rania@gmail.com', '$2b$10$cT6Pv8NER0/dNnyBXfaVK.2C9AgmgqWAKNWGgLMTY7Ms3.9odfbfm', '2026-04-28 15:58:05'),
(3, 'RANIA', 'lybarania@gmail.com', '$2b$10$DbEP0agNuTkzHvPRgCiLG.U.B4zNhPtyp6tuaTEJTwPRuD.Zv.DmW', '2026-04-28 16:48:49');

-- --------------------------------------------------------

--
-- Table structure for table `exchange_requests`
--

CREATE TABLE `exchange_requests` (
  `id` int NOT NULL,
  `requester_id` int NOT NULL,
  `owner_id` int NOT NULL,
  `playlist_id` int NOT NULL,
  `message` text,
  `status` enum('pending','accepted','declined') DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `exchange_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `body` text NOT NULL,
  `sent_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `playlist`
--

CREATE TABLE `playlist` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `playlist`
--

INSERT INTO `playlist` (`id`, `title`, `description`, `created_at`, `user_id`, `genre`) VALUES
(1, 'LL Vibes', 'A calm and personal mix of relaxing songs for quiet evenings.', '2026-03-24 22:18:26', 1, 'R&B'),
(2, 'Midnight Chill', 'Soft late-night tracks for unwinding after a long day.', '2026-03-24 22:18:26', 1, 'R&B'),
(3, 'Feel Good Friday', 'Uplifting songs to start the weekend in a good mood.', '2026-03-24 22:18:26', 1, 'Pop'),
(4, 'Soft Worship Sessions', 'Peaceful worship songs for reflection and calm.', '2026-03-24 22:18:26', 1, 'Worship'),
(5, 'Christmas Comfort', 'Warm and nostalgic songs for the holiday season.', '2026-03-24 22:18:26', 1, 'Pop'),
(6, 'Music and Vibes', 'A balanced playlist for everyday listening and good energy.', '2026-03-24 22:18:26', 2, 'Afrobeats'),
(7, 'Deep Focus Mix', 'Songs that help you stay productive and concentrate.', '2026-03-24 22:18:26', 2, 'Ambient'),
(8, 'Late Night Thoughts', 'Slow tracks for overthinking and quiet moments.', '2026-03-24 22:18:26', 2, 'Alternative'),
(9, 'Stress Relief Sounds', 'Gentle music to ease tension and help you relax.', '2026-03-24 22:18:26', 2, 'Pop'),
(10, 'Weekend Reset', 'Easy listening for resting and resetting on weekends.', '2026-03-24 22:18:26', 2, 'Pop'),
(11, 'Music is Life', 'A playlist full of meaningful songs and strong emotion.', '2026-03-24 22:18:26', 3, 'Alternative'),
(12, 'Workout Energy', 'Fast and energetic tracks for the gym and movement.', '2026-03-24 22:18:26', 3, 'Rap'),
(13, 'Party Starters', 'Songs that bring energy to any gathering.', '2026-03-24 22:18:26', 3, 'Rap'),
(14, 'Throwback Jams', 'Classic throwback songs with familiar vibes.', '2026-03-24 22:18:26', 3, 'Rap'),
(15, 'Motivation Mode', 'Songs that push you to keep going and stay inspired.', '2026-03-24 22:18:26', 3, 'Rap'),
(16, 'Lover of R&B', 'Smooth R&B songs with emotional and romantic vibes.', '2026-03-24 22:18:26', 4, 'R&B'),
(17, 'Romantic Evenings', 'Love songs for relaxed evenings and soft moods.', '2026-03-24 22:18:26', 4, 'R&B'),
(18, 'Sad Girl Hours', 'Emotional songs for reflective and low-energy moments.', '2026-03-24 22:18:26', 4, 'R&B'),
(19, 'Happy Hour Mix', 'Cheerful songs to brighten your mood and day.', '2026-03-24 22:18:26', 4, 'Pop'),
(20, 'Sleepy Sunday', 'Slow and peaceful songs for resting and sleeping.', '2026-03-24 22:18:26', 4, 'Pop'),
(21, 'Reggae & Afrobeats Vibes', 'A warm blend of reggae rhythms and Afrobeats energy.', '2026-03-24 22:18:26', 5, 'Afrobeats'),
(22, 'Chill Escape', 'Relaxing songs for stepping away from stress.', '2026-03-24 22:18:26', 5, 'Ambient'),
(23, 'Study and Breathe', 'Soft music for studying without distractions.', '2026-03-24 22:18:26', 5, 'Ambient'),
(24, 'Worship and Peace', 'Faith-based songs with peaceful, reflective tones.', '2026-03-24 22:18:26', 5, 'Worship'),
(25, 'Energetic Weekend', 'Bright and lively tracks for fun weekend moments.', '2026-03-24 22:18:26', 5, 'Afrobeats'),
(26, 'partyyyy', 'dancing\r\nhype party music!!!', '2026-04-28 16:46:26', 1, 'Dance');

-- --------------------------------------------------------

--
-- Table structure for table `playlist_comments`
--

CREATE TABLE `playlist_comments` (
  `id` int NOT NULL,
  `playlist_id` int NOT NULL,
  `user_id` int NOT NULL,
  `body` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `playlist_comments`
--

INSERT INTO `playlist_comments` (`id`, `playlist_id`, `user_id`, `body`, `created_at`) VALUES
(1, 13, 1, 'cool', '2026-04-24 21:35:19'),
(2, 13, 1, 'funnn', '2026-04-24 22:36:09'),
(3, 13, 2, 'heyeyeyeyye', '2026-04-28 16:09:54'),
(4, 26, 1, 'hey', '2026-04-28 16:46:40'),
(5, 26, 2, 'heyyyyyy im rania', '2026-04-28 16:47:10'),
(6, 26, 2, 'is this rania?', '2026-04-28 16:47:28'),
(7, 26, 3, 'this is RANIA', '2026-04-28 16:49:14');

-- --------------------------------------------------------

--
-- Table structure for table `playlist_likes`
--

CREATE TABLE `playlist_likes` (
  `playlist_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `playlist_ratings`
--

CREATE TABLE `playlist_ratings` (
  `id` int NOT NULL,
  `playlist_id` int NOT NULL,
  `user_id` int NOT NULL,
  `score` tinyint NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `playlist_reports`
--

CREATE TABLE `playlist_reports` (
  `id` int NOT NULL,
  `playlist_id` int NOT NULL,
  `user_id` int NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `playlist_reports`
--

INSERT INTO `playlist_reports` (`id`, `playlist_id`, `user_id`, `reason`, `created_at`) VALUES
(1, 13, 1, 'Reported from playlist detail page', '2026-04-24 21:38:30');

-- --------------------------------------------------------

--
-- Table structure for table `playlist_saves`
--

CREATE TABLE `playlist_saves` (
  `playlist_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `playlist_tags`
--

CREATE TABLE `playlist_tags` (
  `playlist_id` int NOT NULL,
  `tag_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `playlist_tags`
--

INSERT INTO `playlist_tags` (`playlist_id`, `tag_id`) VALUES
(4, 1),
(24, 1),
(7, 2),
(23, 2),
(9, 3),
(22, 3),
(8, 4),
(18, 4),
(5, 5),
(12, 6),
(13, 6),
(15, 6),
(21, 6),
(25, 6),
(20, 7),
(14, 8),
(2, 9),
(8, 9),
(17, 9),
(18, 9),
(1, 10),
(4, 10),
(7, 10),
(9, 10),
(16, 10),
(20, 10),
(23, 10),
(24, 10),
(12, 11),
(3, 12),
(10, 12),
(19, 12),
(25, 12),
(11, 13),
(16, 13),
(17, 13),
(1, 14),
(2, 14),
(6, 14),
(10, 14),
(11, 14),
(21, 14),
(22, 14),
(15, 15),
(3, 16),
(5, 16),
(6, 16),
(14, 16),
(19, 16),
(13, 17);

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` int NOT NULL,
  `rater_id` int NOT NULL,
  `ratee_id` int NOT NULL,
  `exchange_id` int NOT NULL,
  `score` int NOT NULL,
  `comment` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`id`, `rater_id`, `ratee_id`, `exchange_id`, `score`, `comment`, `created_at`) VALUES
(1, 1, 1, 26, 3, '{\"vibe\":null,\"happy\":\"3\",\"situations\":[],\"comment\":\"FIRST RATING\",\"playlistId\":\"26\"}', '2026-04-28 23:16:59'),
(3, 1, 5, 25, 3, '{\"vibe\":\"Gym energy\",\"happy\":\"4\",\"situations\":[\"Party\"],\"comment\":\"FIRST RATING\",\"playlistId\":\"25\"}', '2026-04-28 23:17:35'),
(4, 1, 1, 1, 3, '{\"vibe\":null,\"happy\":\"3\",\"situations\":[],\"comment\":\"RATED ADDED\",\"playlistId\":null}', '2026-04-28 23:19:07');

-- --------------------------------------------------------

--
-- Table structure for table `songs`
--

CREATE TABLE `songs` (
  `id` int NOT NULL,
  `playlist_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `artist` varchar(150) DEFAULT NULL,
  `album` varchar(150) DEFAULT NULL,
  `duration_secs` int DEFAULT NULL,
  `spotify_url` varchar(255) DEFAULT NULL,
  `genre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `songs`
--

INSERT INTO `songs` (`id`, `playlist_id`, `title`, `artist`, `album`, `duration_secs`, `spotify_url`, `genre`) VALUES
(1, 1, 'Best Part', 'Daniel Caesar ft. H.E.R.', 'Freudian', 209, 'https://open.spotify.com/track/1Q7EgiMOuwDcB0PJC6AzON?si=7add90e6790a45f4', 'R&B'),
(2, 1, 'Get You', 'Daniel Caesar ft. Kali Uchis', 'Freudian', 278, 'https://open.spotify.com/track/7zFXmv6vqI4qOt4yGf3jYZ', 'R&B'),
(3, 2, 'Pink + White', 'Frank Ocean', 'Blonde', 184, 'https://open.spotify.com/track/3xKsf9qdS1CyvXSMEid6g8?si=ad084dd5d0064515', 'R&B'),
(4, 2, 'Location', 'Khalid', 'American Teen', 219, 'https://open.spotify.com/track/152lZdxL1OR0ZMW6KquMif?si=d0afef1566724b2c', 'R&B'),
(5, 3, 'Levitating', 'Dua Lipa', 'Future Nostalgia', 203, 'https://open.spotify.com/track/39LLxExYz6ewLAcYrzQQyP?si=4fb2e9887a194826', 'Pop'),
(6, 3, 'Sunday Best', 'Surfaces', 'Where the Light Is', 158, 'https://open.spotify.com/track/1qYKWcEOrh2tM8PlgIm8K1?si=7d8dfb96f53d4943', 'Pop'),
(7, 4, 'Oceans', 'Hillsong UNITED', 'Zion', 536, 'https://open.spotify.com/track/0Bn1DSXfisvfKjGUwI6rzW?si=b03a550955294c7e', 'Worship'),
(8, 4, 'Goodness of God', 'CeCe Winans', 'Believe For It', 298, 'https://open.spotify.com/track/59uuKDpLFhHtCWwMudospF?si=2626fc7a8f84466c', 'Gospel'),
(9, 5, 'Mistletoe', 'Justin Bieber', 'Under the Mistletoe', 182, 'https://open.spotify.com/track/7xapw9Oy21WpfEcib2ErSA?si=1dc2af4138844b41', 'Pop'),
(10, 5, 'All I Want for Christmas Is You', 'Mariah Carey', 'Merry Christmas', 241, 'https://open.spotify.com/track/0bYg9bo50gSsH3LtXe2SQn?si=23b21b6f5e814d4c', 'Pop'),
(11, 6, 'Peaches', 'Justin Bieber', 'Justice', 198, 'https://open.spotify.com/track/4iJyoBOLtHqaGxP12qzhQI?si=373279333ccc4d20', 'Pop'),
(12, 6, 'Essence', 'Wizkid ft. Tems', 'Made in Lagos', 249, 'https://open.spotify.com/track/1mSdbey7RstGLY2udgXv74?si=8f098d40ea804109', 'Afrobeats'),
(13, 7, 'Intro', 'The xx', 'xx', 127, 'https://open.spotify.com/track/2usrT8QIbIk9y0NEtQwS4j?si=2117e123c4a34cb8', 'Indie'),
(14, 7, 'Weightless', 'Marconi Union', 'Weightless', 480, 'https://open.spotify.com/track/6kkwzB6hXLIONkEk9JciA6?si=a4587f4f4daa48c3', 'Ambient'),
(15, 8, 'Night Changes', 'One Direction', 'Four', 226, 'https://open.spotify.com/track/5O2P9iiztwhomNh8xkR9lJ?si=6ed8b7ce055241b8', 'Pop'),
(16, 8, 'Liability', 'Lorde', 'Melodrama', 171, 'https://open.spotify.com/track/6Kkt27YmFyIFrcX3QXFi2o?si=14a2704e1dad4ead', 'Pop'),
(17, 9, 'Breathe Me', 'Sia', 'Colour the Small One', 272, 'https://open.spotify.com/track/7jqzZyJJLrpkRFYGpkqSK6?si=1195809fc29f426b', 'Alternative'),
(18, 9, 'River Flows in You', 'Yiruma', 'First Love', 186, 'https://open.spotify.com/track/2agBDIr9MYDUducQPC1sFU?si=b72415fba1384eaf', 'Instrumental'),
(19, 10, 'Better Together', 'Jack Johnson', 'In Between Dreams', 207, 'https://open.spotify.com/track/2iXdwVdzA0KrI2Q0iZNJbX?si=8f7419344f624c54', 'Acoustic'),
(20, 10, 'Put Your Records On', 'Corinne Bailey Rae', 'Corinne Bailey Rae', 215, 'https://open.spotify.com/track/2nGFzvICaeEWjIrBrL2RAx?si=a0d3719c7e354812', 'Soul'),
(21, 11, 'Love on the Brain', 'Rihanna', 'ANTI', 224, 'https://open.spotify.com/track/5oO3drDxtziYU2H1X23ZIp?si=9a6f1d85ab1f4755', 'R&B'),
(22, 11, 'Superstar', 'Jamelia', 'Thank You', 223, 'https://open.spotify.com/track/5u5MpBnvJejW9dHPrfWEXZ?si=943e9df6cd77471d', 'R&B'),
(23, 12, 'Stronger', 'Kanye West', 'Graduation', 311, 'https://open.spotify.com/track/0j2T0R9dR9qdJYsB7ciXhf?si=53175b8ca9be4571', 'Rap'),
(24, 12, 'Power', 'Kanye West', 'My Beautiful Dark Twisted Fantasy', 292, 'https://open.spotify.com/track/2gZUPNdnz5Y45eiGxpHGSc?si=ff7858e4da814908', 'Rap'),
(25, 13, 'Yeah!', 'Usher ft. Lil Jon & Ludacris', 'Confessions', 250, 'https://open.spotify.com/track/5rb9QrpfcKFHM1EUbSIurX?si=b934a8984aca4409', 'R&B'),
(26, 13, 'Turn Down for What', 'DJ Snake ft. Lil Jon', 'Single', 213, 'https://open.spotify.com/track/67awxiNHNyjMXhVgsHuIrs?si=ea817c739f4a4dac', 'Dance'),
(27, 14, 'Crazy in Love', 'Beyonce ft. Jay-Z', 'Dangerously in Love', 236, 'https://open.spotify.com/track/5IVuqXILoxVWvWEPm82Jxr?si=73d252f6fd5b4cf3', 'R&B'),
(28, 14, 'No Scrubs', 'TLC', 'FanMail', 214, 'https://open.spotify.com/track/1KGi9sZVMeszgZOWivFpxs?si=770c8f34d4c34735', 'R&B'),
(29, 15, 'Remember the Name', 'Fort Minor', 'The Rising Tied', 230, 'https://open.spotify.com/track/6ndmKwWqMozN2tcZqzCX4K?si=9aaff8f296d14d08', 'Rap'),
(30, 15, 'Hall of Fame', 'The Script ft. will.i.am', '#3', 202, 'https://open.spotify.com/track/7wMq5n8mYSKlQIGECKUgTX?si=5a094dc9ae4d4030', 'Pop'),
(31, 16, 'Damage', 'H.E.R.', 'Back of My Mind', 230, 'https://open.spotify.com/track/0KS2h61pHQ4WmOwruD7uxD?si=16586f3302e64a99', 'R&B'),
(32, 16, 'We Belong Together', 'Mariah Carey', 'The Emancipation of Mimi', 201, 'https://open.spotify.com/track/61sRkEACcXECFXGjbEzm4V?si=178f7905cc164f71', 'R&B'),
(33, 17, 'Earned It', 'The Weeknd', 'Beauty Behind the Madness', 250, 'https://open.spotify.com/track/1cQ3LIkZE68pMSnPhZWXLu?si=b32302ea35d44449', 'R&B'),
(34, 17, 'Adore You', 'Harry Styles', 'Fine Line', 207, 'https://open.spotify.com/track/3jjujdWJ72nww5eGnfs2E7?si=23a4b2a9bbd04fef', 'Pop'),
(35, 18, 'Someone Like You', 'Adele', '21', 285, 'https://open.spotify.com/track/3bNv3VuUOKgrf5hu3YcuRo?si=dd55cf1d4895485a', 'Pop'),
(36, 18, 'Liability', 'Lorde', 'Melodrama', 171, 'https://open.spotify.com/track/6Kkt27YmFyIFrcX3QXFi2o?si=f4ccd8013dea46e6', 'Pop'),
(37, 19, 'Happy', 'Pharrell Williams', 'G I R L', 233, 'https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH?si=5457f95ef9434728', 'Pop'),
(38, 19, 'Good as Hell', 'Lizzo', 'Cuz I Love You', 159, 'https://open.spotify.com/track/6KgBpzTuTRPebChN0VTyzV?si=12b32d3ca75947d1', 'Pop'),
(39, 20, 'Lovely', 'Billie Eilish & Khalid', 'Single', 201, 'https://open.spotify.com/track/1NJcg626wLln4pGHpiV7mf?si=0301dbb7ef7f4799', 'Pop'),
(40, 20, 'Slow Dancing in the Dark', 'Joji', 'BALLADS 1', 209, 'https://open.spotify.com/track/6rY5FAWxCdAGllYEOZMbjW?si=74c339f3177349fb', 'Alternative'),
(41, 21, 'Calm Down', 'Rema', 'Rave & Roses', 219, 'https://open.spotify.com/track/6hgoYQDUcPyCz7LcTUHKxa?si=9e309f3f84e346db', 'Afrobeats'),
(42, 21, 'Toast', 'Koffee', 'Rapture', 183, 'https://open.spotify.com/track/45tHjcM6gERQ7kCEDTG4al?si=fee9897e1886423b', 'Reggae'),
(43, 22, 'Sunflower', 'Post Malone & Swae Lee', 'Spider-Man: Into the Spider-Verse', 158, 'https://open.spotify.com/track/0RiRZpuVRbi7oqRdSMwhQY?si=289137ab94da4b94', 'Pop'),
(44, 22, 'Who Knows', 'Daniel Caesar', 'Son of Spergy ', 209, 'https://open.spotify.com/track/6DH13QYXK7lKkYHSU88N48?si=f3515b8ed3ce46f6', 'R&B'),
(45, 23, 'Ocean Eyes', 'Billie Eilish', 'Dont Smile at Me', 200, 'https://open.spotify.com/track/3OMh7VdOoWgtKhJimQQywz', 'Pop'),
(46, 23, 'Holocene', 'Bon Iver', 'Bon Iver', 337, 'https://open.spotify.com/track/4fbvXwMTXPWaFyaMWUm9CR', 'Indie'),
(47, 24, 'Jireh', 'Elevation Worship & Maverick City Music', 'Old Church Basement', 578, 'https://open.spotify.com/track/1goiRWxiG3GTlODrdDZ7NR', 'Worship'),
(48, 24, 'Way Maker', 'Sinach', 'Single', 300, 'https://open.spotify.com/track/11xI35wCbCmIlU4x3b0Jv1', 'Gospel'),
(49, 25, 'Soweto', 'Victony', 'Outlaw', 180, 'https://open.spotify.com/track/7p85HOOjg1q3lqKovxeiOC', 'Afrobeats'),
(50, 25, 'One Kiss', 'Calvin Harris & Dua Lipa', 'Single', 214, 'https://open.spotify.com/track/7ef4DlsgrMEH11cDZd32M6', 'Dance');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`) VALUES
(14, 'Chill'),
(5, 'Christmas'),
(6, 'Energetic'),
(18, 'Focus'),
(16, 'Happy'),
(9, 'Late Night'),
(15, 'Motivation'),
(17, 'Party'),
(10, 'Relaxing'),
(13, 'Romantic'),
(4, 'Sad'),
(7, 'Sleep'),
(3, 'Stress Relief'),
(2, 'Study'),
(8, 'Throwback'),
(12, 'Weekend'),
(11, 'Workout'),
(1, 'Worship');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(250) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `bio` text,
  `profile_pic` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `bio`, `profile_pic`, `created_at`) VALUES
(1, 'Lyba Ahmad', 'lybaaaa@gmail.com', 'lylyba123', 'LL Vibes', 'lyba.jpg', '2026-03-24 21:29:04'),
(2, 'Rania Em', 'raniam@gmail.com', 'rania_123', 'Music and Vibes', 'rania.jpg', '2026-03-24 21:29:04'),
(3, 'Tobi Francis', 'tobias@ymail.com', 'tobiasss23', 'Music is life', 'tobi.jpg', '2026-03-24 21:29:04'),
(4, 'Malieka Morris', 'mallym@hotmail.com', 'maliekam89', 'Lover of R&B', 'malieka.jpg', '2026-03-24 21:29:04'),
(5, 'Darren Smith', 'dsmith@hotmail.com', 'smithfan123', 'Loves Reggae and Afrobeats', 'darren.jpg', '2026-03-24 21:29:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Account`
--
ALTER TABLE `Account`
  ADD PRIMARY KEY (`AccountID`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `exchange_requests`
--
ALTER TABLE `exchange_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `er_fk1` (`requester_id`),
  ADD KEY `er_fk2` (`owner_id`),
  ADD KEY `er_fk3` (`playlist_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `msg_fk1` (`exchange_id`),
  ADD KEY `msg_fk2` (`sender_id`);

--
-- Indexes for table `playlist`
--
ALTER TABLE `playlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `playlist_comments`
--
ALTER TABLE `playlist_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pc_playlist_idx` (`playlist_id`),
  ADD KEY `pc_user_idx` (`user_id`);

--
-- Indexes for table `playlist_likes`
--
ALTER TABLE `playlist_likes`
  ADD PRIMARY KEY (`playlist_id`,`user_id`),
  ADD KEY `pl_like_user_fk` (`user_id`);

--
-- Indexes for table `playlist_ratings`
--
ALTER TABLE `playlist_ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_playlist_rating` (`playlist_id`,`user_id`),
  ADD KEY `prt_user_fk` (`user_id`);

--
-- Indexes for table `playlist_reports`
--
ALTER TABLE `playlist_reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_playlist_report` (`playlist_id`,`user_id`),
  ADD KEY `pr_user_fk` (`user_id`);

--
-- Indexes for table `playlist_saves`
--
ALTER TABLE `playlist_saves`
  ADD PRIMARY KEY (`playlist_id`,`user_id`),
  ADD KEY `pl_save_user_fk` (`user_id`);

--
-- Indexes for table `playlist_tags`
--
ALTER TABLE `playlist_tags`
  ADD PRIMARY KEY (`playlist_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `one_rating_per_exchange` (`rater_id`,`exchange_id`),
  ADD KEY `rat_fk2` (`ratee_id`),
  ADD KEY `rat_fk3` (`exchange_id`);

--
-- Indexes for table `songs`
--
ALTER TABLE `songs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `playlist_id` (`playlist_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Account`
--
ALTER TABLE `Account`
  MODIFY `AccountID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `exchange_requests`
--
ALTER TABLE `exchange_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `playlist`
--
ALTER TABLE `playlist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `playlist_comments`
--
ALTER TABLE `playlist_comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `playlist_ratings`
--
ALTER TABLE `playlist_ratings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `playlist_reports`
--
ALTER TABLE `playlist_reports`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `songs`
--
ALTER TABLE `songs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `exchange_requests`
--
ALTER TABLE `exchange_requests`
  ADD CONSTRAINT `er_fk1` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `er_fk2` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `er_fk3` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `msg_fk1` FOREIGN KEY (`exchange_id`) REFERENCES `exchange_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `msg_fk2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `playlist`
--
ALTER TABLE `playlist`
  ADD CONSTRAINT `playlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `playlist_comments`
--
ALTER TABLE `playlist_comments`
  ADD CONSTRAINT `pc_playlist_fk` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pc_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `playlist_likes`
--
ALTER TABLE `playlist_likes`
  ADD CONSTRAINT `pl_like_playlist_fk` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pl_like_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `playlist_ratings`
--
ALTER TABLE `playlist_ratings`
  ADD CONSTRAINT `prt_playlist_fk` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `prt_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `playlist_reports`
--
ALTER TABLE `playlist_reports`
  ADD CONSTRAINT `pr_playlist_fk` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pr_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `playlist_saves`
--
ALTER TABLE `playlist_saves`
  ADD CONSTRAINT `pl_save_playlist_fk` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pl_save_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `playlist_tags`
--
ALTER TABLE `playlist_tags`
  ADD CONSTRAINT `playlist_tags_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `playlist_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `rat_fk1` FOREIGN KEY (`rater_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rat_fk2` FOREIGN KEY (`ratee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `songs`
--
ALTER TABLE `songs`
  ADD CONSTRAINT `songs_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
