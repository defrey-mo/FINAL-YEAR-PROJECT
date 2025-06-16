-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2025 at 02:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `final_year_projectdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `conduct`
--

CREATE TABLE `conduct` (
  `ID` int(11) NOT NULL,
  `student_id` varchar(200) NOT NULL,
  `type_of_conduct` varchar(200) NOT NULL,
  `nature_of_incident` varchar(200) NOT NULL,
  `detailed_description` text NOT NULL,
  `action_taken` varchar(200) NOT NULL,
  `teacher_staff_report` varchar(200) DEFAULT NULL,
  `witness` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deleted_conduct`
--

CREATE TABLE `deleted_conduct` (
  `ID` int(11) NOT NULL,
  `student_id` varchar(200) NOT NULL,
  `type_of_conduct` varchar(200) NOT NULL,
  `nature_of_incident` varchar(200) NOT NULL,
  `detailed_description` text NOT NULL,
  `action_taken` varchar(200) NOT NULL,
  `teacher_staff_report` text NOT NULL,
  `witness` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deleted_conduct`
--

INSERT INTO `deleted_conduct` (`ID`, `student_id`, `type_of_conduct`, `nature_of_incident`, `detailed_description`, `action_taken`, `teacher_staff_report`, `witness`) VALUES
(12, 'STU-31850', 'Negative', 'Cheating Exams', 'Caught with malpractice materials', 'Suspension', '', ''),
(13, 'STU-41799', 'Negative', 'Homosexuallity', 'Caught having sex with the same gender', 'Expulsion', '', ''),
(14, 'STU-41799', 'Negative', 'Bullying', 'Bullying new incoming students ', 'Written Warning', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `deleted_status`
--

CREATE TABLE `deleted_status` (
  `ID` int(11) NOT NULL,
  `student_id` varchar(200) NOT NULL,
  `registration_status` varchar(200) NOT NULL,
  `fee_payment_status` varchar(200) NOT NULL,
  `scholarship_financial_aid` varchar(200) NOT NULL,
  `emotional_wellbeing` varchar(200) NOT NULL,
  `peer_relationship` varchar(200) NOT NULL,
  `guardian_contact` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deleted_status`
--

INSERT INTO `deleted_status` (`ID`, `student_id`, `registration_status`, `fee_payment_status`, `scholarship_financial_aid`, `emotional_wellbeing`, `peer_relationship`, `guardian_contact`) VALUES
(8, 'STU-31850', 'Very Good', 'Partially Paid', 'No', 'Happy', 'Average', '0773388119'),
(9, 'STU-31850', 'Very Good', 'Fully Paid', 'Yes', 'Happy', 'Good', '0773388119'),
(10, 'STU-31850', 'Very Good', 'Fully Paid', 'Yes', 'Happy', 'Good', '0773388119'),
(11, 'STU-41799', 'Very Good', 'Fully Paid', 'Yes', 'Happy', 'Good', '0773388119');

-- --------------------------------------------------------

--
-- Table structure for table `deleted_students`
--

CREATE TABLE `deleted_students` (
  `student_id` varchar(200) NOT NULL,
  `firstname` varchar(200) NOT NULL,
  `middlename` varchar(200) NOT NULL,
  `surname` varchar(200) NOT NULL,
  `school_id` varchar(200) NOT NULL,
  `dob` varchar(200) NOT NULL,
  `gender` varchar(200) NOT NULL,
  `medical_info` text NOT NULL,
  `guardian_fullnames` varchar(200) NOT NULL,
  `guardian_phone` varchar(200) NOT NULL,
  `guardian_email` varchar(200) NOT NULL,
  `home_address` text NOT NULL,
  `prev_school` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deleted_students`
--

INSERT INTO `deleted_students` (`student_id`, `firstname`, `middlename`, `surname`, `school_id`, `dob`, `gender`, `medical_info`, `guardian_fullnames`, `guardian_phone`, `guardian_email`, `home_address`, `prev_school`) VALUES
('STU-31850', 'Bwire', 'Fredrick', 'Defrey', 'Sch-336', '2004-05-27', 'male', 'Allergic to meat', 'Henry Magoti', '0787012939', 'fredrickbwirefb254@gmail.com', 'Busia', ''),
('STU-41799', 'THOMAS', 'OGWAL', 'BALUKU', 'Sch-336', '2006-09-20', 'male', 'No serious condition', 'ODONGO JAMES', '0753914907', 'odongo@gmail.com', 'Mutungo', ''),
('STU-88620', 'THOMAS', 'OGWAL', 'BALUKU', 'Sch-336', '2002-12-01', 'male', 'No serious condition', 'ODONGO JAMES', '0798909455', 'maria@gmail.com', 'Mutungo', '');

-- --------------------------------------------------------

--
-- Table structure for table `schools`
--

CREATE TABLE `schools` (
  `school_id` varchar(200) NOT NULL,
  `school_name` varchar(200) NOT NULL,
  `school_type` varchar(200) NOT NULL,
  `school_system` varchar(200) NOT NULL,
  `phone_number` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `physical_address` varchar(200) NOT NULL,
  `mailing_address` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`school_id`, `school_name`, `school_type`, `school_system`, `phone_number`, `email`, `physical_address`, `mailing_address`) VALUES
('Sch-336', 'New Planet Primary School', 'Primary', 'Private', '0798745632', 'newplanet@gmail.com', 'Namuwongo', '2345'),
('Sch-951', 'St. Miriam Primary School', 'Primary School', 'Private', '0798909455', 'st.miriam@gmail.com', 'Namuwongo', '2345');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` varchar(200) NOT NULL,
  `firstname` varchar(200) NOT NULL,
  `middlename` varchar(200) NOT NULL,
  `surname` varchar(200) NOT NULL,
  `nationality` varchar(200) NOT NULL,
  `gender` varchar(200) NOT NULL,
  `school_id` varchar(200) NOT NULL,
  `phone` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `home_address` varchar(200) NOT NULL,
  `emergency_name` varchar(200) DEFAULT NULL,
  `emergency_phone` varchar(200) DEFAULT NULL,
  `emergency_email` varchar(200) DEFAULT NULL,
  `emergency_address` varchar(200) DEFAULT NULL,
  `username` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `role` varchar(200) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `firstname`, `middlename`, `surname`, `nationality`, `gender`, `school_id`, `phone`, `email`, `home_address`, `emergency_name`, `emergency_phone`, `emergency_email`, `emergency_address`, `username`, `password`, `role`, `isActive`) VALUES
('STF-150', 'fredrick', 'bwire', 'defrey', 'ugandan', 'Male', 'Sch-336', '0773388119', 'defrey@gmail.com', 'busia', '', '', '', '', 'defrey', '$2b$10$q4W.1b5XiweFcbOf/HeYeejgWV6IKWaHcagveKep/6G8AdYFq1d4i', 'Admin', 1),
('STF-328', 'Sophia', 'Sophie', 'Nantongo', 'Ugandan', 'female', 'Sch-336', '12345678', 'qasdfg@sdfg', 'sdrfghj', '', '', '', '', 'sophie', '$2b$10$bQ..aujiDy45t/LB9XP1aOOOguSXN6vc/q2sNhMOiB2ENFUNEpCeu', 'Admin', 1),
('STF-410', 'Joan', 'Nakirima', 'Joan', 'Ugandan', 'female', 'Sch-951', '0753914907', 'qwertyu@gmail.com', 'asdfghj', '', '', '', '', 'joan', '$2b$10$EmYzWxCgD2kDMsHLHQ2tduHN62NxZlsWAlviNWVtXjFB8OWKe92rm', 'teacher', 1),
('STF-885', 'Christine', 'Christine', 'Ainebyoona', 'Ugandan', 'female', 'Sch-951', '0773388119', 'qwert@gmail.com', 'Mukono', '', '', '', '', 'ainebyoona', '$2b$10$Ft5.s4MzxxqLpEKliHWsZOZKC2ftqdZMFMnpbQKAYcJuS/IHC9hgW', 'Admin', 1);

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `ID` int(11) NOT NULL,
  `student_id` varchar(200) NOT NULL,
  `registration_status` varchar(200) NOT NULL,
  `fee_payment_status` varchar(200) NOT NULL,
  `scholarship_financial_aid` varchar(200) NOT NULL,
  `emotional_wellbeing` varchar(200) NOT NULL,
  `peer_relationship` varchar(200) NOT NULL,
  `guardian_contact` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` varchar(200) NOT NULL,
  `firstname` varchar(200) NOT NULL,
  `middlename` varchar(200) NOT NULL,
  `surname` varchar(200) NOT NULL,
  `dob` varchar(200) NOT NULL,
  `gender` varchar(200) NOT NULL,
  `medical_info` text NOT NULL,
  `guardian_fullnames` varchar(200) NOT NULL,
  `guardian_phone` varchar(200) NOT NULL,
  `guardian_email` varchar(200) NOT NULL,
  `home_address` text NOT NULL,
  `prev_school` varchar(200) DEFAULT NULL,
  `school_id` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `conduct`
--
ALTER TABLE `conduct`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `deleted_conduct`
--
ALTER TABLE `deleted_conduct`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `deleted_status`
--
ALTER TABLE `deleted_status`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `deleted_students`
--
ALTER TABLE `deleted_students`
  ADD PRIMARY KEY (`student_id`);

--
-- Indexes for table `schools`
--
ALTER TABLE `schools`
  ADD PRIMARY KEY (`school_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `student_id` (`student_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `school_id` (`school_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `conduct`
--
ALTER TABLE `conduct`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `deleted_conduct`
--
ALTER TABLE `deleted_conduct`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `deleted_status`
--
ALTER TABLE `deleted_status`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `conduct`
--
ALTER TABLE `conduct`
  ADD CONSTRAINT `conduct_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `deleted_conduct`
--
ALTER TABLE `deleted_conduct`
  ADD CONSTRAINT `deleted_conduct_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `deleted_students` (`student_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `deleted_status`
--
ALTER TABLE `deleted_status`
  ADD CONSTRAINT `deleted_status_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `deleted_students` (`student_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `status`
--
ALTER TABLE `status`
  ADD CONSTRAINT `status_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
