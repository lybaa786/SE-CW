-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 24, 2026 at 10:25 PM
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
-- Table structure for table `playlist`
--

CREATE TABLE `playlist` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `playlist`
--

INSERT INTO `playlist` (`id`, `title`, `description`, `created_at`, `user_id`) VALUES
(1, 'LL Vibes', 'A calm and personal mix of relaxing songs for quiet evenings.', '2026-03-24 22:18:26', 1),
(2, 'Midnight Chill', 'Soft late-night tracks for unwinding after a long day.', '2026-03-24 22:18:26', 1),
(3, 'Feel Good Friday', 'Uplifting songs to start the weekend in a good mood.', '2026-03-24 22:18:26', 1),
(4, 'Soft Worship Sessions', 'Peaceful worship songs for reflection and calm.', '2026-03-24 22:18:26', 1),
(5, 'Christmas Comfort', 'Warm and nostalgic songs for the holiday season.', '2026-03-24 22:18:26', 1),
(6, 'Music and Vibes', 'A balanced playlist for everyday listening and good energy.', '2026-03-24 22:18:26', 2),
(7, 'Deep Focus Mix', 'Songs that help you stay productive and concentrate.', '2026-03-24 22:18:26', 2),
(8, 'Late Night Thoughts', 'Slow tracks for overthinking and quiet moments.', '2026-03-24 22:18:26', 2),
(9, 'Stress Relief Sounds', 'Gentle music to ease tension and help you relax.', '2026-03-24 22:18:26', 2),
(10, 'Weekend Reset', 'Easy listening for resting and resetting on weekends.', '2026-03-24 22:18:26', 2),
(11, 'Music is Life', 'A playlist full of meaningful songs and strong emotion.', '2026-03-24 22:18:26', 3),
(12, 'Workout Energy', 'Fast and energetic tracks for the gym and movement.', '2026-03-24 22:18:26', 3),
(13, 'Party Starters', 'Songs that bring energy to any gathering.', '2026-03-24 22:18:26', 3),
(14, 'Throwback Jams', 'Classic throwback songs with familiar vibes.', '2026-03-24 22:18:26', 3),
(15, 'Motivation Mode', 'Songs that push you to keep going and stay inspired.', '2026-03-24 22:18:26', 3),
(16, 'Lover of R&B', 'Smooth R&B songs with emotional and romantic vibes.', '2026-03-24 22:18:26', 4),
(17, 'Romantic Evenings', 'Love songs for relaxed evenings and soft moods.', '2026-03-24 22:18:26', 4),
(18, 'Sad Girl Hours', 'Emotional songs for reflective and low-energy moments.', '2026-03-24 22:18:26', 4),
(19, 'Happy Hour Mix', 'Cheerful songs to brighten your mood and day.', '2026-03-24 22:18:26', 4),
(20, 'Sleepy Sunday', 'Slow and peaceful songs for resting and sleeping.', '2026-03-24 22:18:26', 4),
(21, 'Reggae & Afrobeats Vibes', 'A warm blend of reggae rhythms and Afrobeats energy.', '2026-03-24 22:18:26', 5),
(22, 'Chill Escape', 'Relaxing songs for stepping away from stress.', '2026-03-24 22:18:26', 5),
(23, 'Study and Breathe', 'Soft music for studying without distractions.', '2026-03-24 22:18:26', 5),
(24, 'Worship and Peace', 'Faith-based songs with peaceful, reflective tones.', '2026-03-24 22:18:26', 5),
(25, 'Energetic Weekend', 'Bright and lively tracks for fun weekend moments.', '2026-03-24 22:18:26', 5);

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
(1, 1, 'Best Part', 'Daniel Caesar ft. H.E.R.', 'Freudian', 209, NULL, 'R&B'),
(2, 1, 'Get You', 'Daniel Caesar ft. Kali Uchis', 'Freudian', 278, NULL, 'R&B'),
(3, 2, 'Pink + White', 'Frank Ocean', 'Blonde', 184, NULL, 'R&B'),
(4, 2, 'Location', 'Khalid', 'American Teen', 219, NULL, 'R&B'),
(5, 3, 'Levitating', 'Dua Lipa', 'Future Nostalgia', 203, NULL, 'Pop'),
(6, 3, 'Sunday Best', 'Surfaces', 'Where the Light Is', 158, NULL, 'Pop'),
(7, 4, 'Oceans', 'Hillsong UNITED', 'Zion', 536, NULL, 'Worship'),
(8, 4, 'Goodness of God', 'CeCe Winans', 'Believe For It', 298, NULL, 'Gospel'),
(9, 5, 'Mistletoe', 'Justin Bieber', 'Under the Mistletoe', 182, NULL, 'Pop'),
(10, 5, 'All I Want for Christmas Is You', 'Mariah Carey', 'Merry Christmas', 241, NULL, 'Pop'),
(11, 6, 'Peaches', 'Justin Bieber', 'Justice', 198, NULL, 'Pop'),
(12, 6, 'Essence', 'Wizkid ft. Tems', 'Made in Lagos', 249, NULL, 'Afrobeats'),
(13, 7, 'Intro', 'The xx', 'xx', 127, NULL, 'Indie'),
(14, 7, 'Weightless', 'Marconi Union', 'Weightless', 480, NULL, 'Ambient'),
(15, 8, 'Night Changes', 'One Direction', 'Four', 226, NULL, 'Pop'),
(16, 8, 'Liability', 'Lorde', 'Melodrama', 171, NULL, 'Pop'),
(17, 9, 'Breathe Me', 'Sia', 'Colour the Small One', 272, NULL, 'Alternative'),
(18, 9, 'River Flows in You', 'Yiruma', 'First Love', 186, NULL, 'Instrumental'),
(19, 10, 'Better Together', 'Jack Johnson', 'In Between Dreams', 207, NULL, 'Acoustic'),
(20, 10, 'Put Your Records On', 'Corinne Bailey Rae', 'Corinne Bailey Rae', 215, NULL, 'Soul'),
(21, 11, 'Love on the Brain', 'Rihanna', 'ANTI', 224, NULL, 'R&B'),
(22, 11, 'Superstar', 'Jamelia', 'Thank You', 223, NULL, 'R&B'),
(23, 12, 'Stronger', 'Kanye West', 'Graduation', 311, NULL, 'Rap'),
(24, 12, 'Power', 'Kanye West', 'My Beautiful Dark Twisted Fantasy', 292, NULL, 'Rap'),
(25, 13, 'Yeah!', 'Usher ft. Lil Jon & Ludacris', 'Confessions', 250, NULL, 'R&B'),
(26, 13, 'Turn Down for What', 'DJ Snake ft. Lil Jon', 'Single', 213, NULL, 'Dance'),
(27, 14, 'Crazy in Love', 'Beyonce ft. Jay-Z', 'Dangerously in Love', 236, NULL, 'R&B'),
(28, 14, 'No Scrubs', 'TLC', 'FanMail', 214, NULL, 'R&B'),
(29, 15, 'Remember the Name', 'Fort Minor', 'The Rising Tied', 230, NULL, 'Rap'),
(30, 15, 'Hall of Fame', 'The Script ft. will.i.am', '#3', 202, NULL, 'Pop'),
(31, 16, 'Damage', 'H.E.R.', 'Back of My Mind', 230, NULL, 'R&B'),
(32, 16, 'We Belong Together', 'Mariah Carey', 'The Emancipation of Mimi', 201, NULL, 'R&B'),
(33, 17, 'Earned It', 'The Weeknd', 'Beauty Behind the Madness', 250, NULL, 'R&B'),
(34, 17, 'Adore You', 'Harry Styles', 'Fine Line', 207, NULL, 'Pop'),
(35, 18, 'Someone Like You', 'Adele', '21', 285, NULL, 'Pop'),
(36, 18, 'Liability', 'Lorde', 'Melodrama', 171, NULL, 'Pop'),
(37, 19, 'Happy', 'Pharrell Williams', 'G I R L', 233, NULL, 'Pop'),
(38, 19, 'Good as Hell', 'Lizzo', 'Cuz I Love You', 159, NULL, 'Pop'),
(39, 20, 'Lovely', 'Billie Eilish & Khalid', 'Single', 201, NULL, 'Pop'),
(40, 20, 'Slow Dancing in the Dark', 'Joji', 'BALLADS 1', 209, NULL, 'Alternative'),
(41, 21, 'Calm Down', 'Rema', 'Rave & Roses', 219, NULL, 'Afrobeats'),
(42, 21, 'Toast', 'Koffee', 'Rapture', 183, NULL, 'Reggae'),
(43, 22, 'Sunflower', 'Post Malone & Swae Lee', 'Spider-Man: Into the Spider-Verse', 158, NULL, 'Pop'),
(44, 22, 'Best Part', 'Daniel Caesar ft. H.E.R.', 'Freudian', 209, NULL, 'R&B'),
(45, 23, 'Ocean Eyes', 'Billie Eilish', 'Dont Smile at Me', 200, NULL, 'Pop'),
(46, 23, 'Holocene', 'Bon Iver', 'Bon Iver', 337, NULL, 'Indie'),
(47, 24, 'Jireh', 'Elevation Worship & Maverick City Music', 'Old Church Basement', 578, NULL, 'Worship'),
(48, 24, 'Way Maker', 'Sinach', 'Single', 300, NULL, 'Gospel'),
(49, 25, 'Soweto', 'Victony', 'Outlaw', 180, NULL, 'Afrobeats'),
(50, 25, 'One Kiss', 'Calvin Harris & Dua Lipa', 'Single', 214, NULL, 'Dance');

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
-- Indexes for table `playlist`
--
ALTER TABLE `playlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `playlist_tags`
--
ALTER TABLE `playlist_tags`
  ADD PRIMARY KEY (`playlist_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

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
-- AUTO_INCREMENT for table `playlist`
--
ALTER TABLE `playlist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

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
-- Constraints for table `playlist`
--
ALTER TABLE `playlist`
  ADD CONSTRAINT `playlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `playlist_tags`
--
ALTER TABLE `playlist_tags`
  ADD CONSTRAINT `playlist_tags_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `playlist_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `songs`
--
ALTER TABLE `songs`
  ADD CONSTRAINT `songs_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
