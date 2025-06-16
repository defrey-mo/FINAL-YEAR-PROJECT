ICT Group 5 2023cohort
Group members
1.BWIRE FREDRICK 2023/DCS/EVE/1048
2.MUGWERI ERYAZALI 2023/DCS/EVE/0233
3.AINEBYOONA CHRISTINE 2023/DCS/EVE/0425
4.NANTONGO SOPHIA 2023/DCS/EVE/1390
5.OGWAL THOMAS BALUKU 2023/DCS/EVE/0928
6.NAKIRIMA JOAN 2023/DCS/EVE/1480

# Students' Misconduct and Behaviour System

The **Students' Misconduct and Behaviour System** is a web-based platform designed to assist schools in Uganda (and beyond) to efficiently manage and track student discipline records. 
The system enables schools to log, retrieve, and monitor student conduct such as absenteeism, bullying, academic dishonesty, drug use, and other behavioral issues.

The goal is to replace traditional, error-prone paper-based systems with a centralized and secure platform that supports accountability, improves data accuracy, and provides better communication between school staff and administrators.


## Features

- **Student Management**
  - Register and manage student information.
  - Track admission date, gender, school, and contact details.

- **Behaviour and Conduct Reporting**
  - Record different types of misconduct against a student.
  - Track behavioral incidents with categories, dates, and staff comments.

- **Role-Based Access Control**
  - Admins: Manage staff accounts and view all reports.
  - Teachers: Add and manage conduct records.
  - Registrars: View and verify students and misconduct details.

- **School Isolation Logic**
  - Each school only sees its own students.
  - Ability to verify a student’s record from another school during transfers.

- **Conduct and Status Reports**
  - Generate student-wise reports including history of misconduct.
  - View summary of behavioral trends per school.

- **Authentication & Authorization**
  - Login system secured with JWT.
  - Passwords encrypted with bcrypt for security.

- **API Integration**
  - RESTful APIs used to connect the frontend and backend.
  - Supports JSON-based data communication.

---

## Technologies Used

### Backend
- **Node.js** – JavaScript runtime
- **Express.js** – Web server framework
- **MySQL** – Relational database (via phpMyAdmin in XAMPP)
- **JWT (jsonwebtoken)** – Secure authentication tokens
- **bcrypt** – Password hashing

### Frontend
- **React.js** – JavaScript library for the user interface
- **Axios** – Handles HTTP requests
- **React Router DOM** – For navigating between pages
- **CSS** – Custom styling for user interface

### Tools & Utilities
- **XAMPP / phpMyAdmin** – For MySQL database management
- **Thunder Client / Postman** – API testing
- **Git & GitHub** – Version control and collaboration


