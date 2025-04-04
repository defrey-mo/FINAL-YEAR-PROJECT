import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.post("/schools", (req, res) => {
  const sql =
    "INSERT INTO schools VALUE (" +
    `'${req.body.school_id}',
    '${req.body.school_name}',
    '${req.body.school_type}',
    '${req.body.school_system}',
    '${req.body.phone_number}',
    '${req.body.email}',
    '${req.body.physical_address}',
    '${req.body.mailing_address}'
  );`;
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.post("/staffs", async (req, res) => {
  try {
    const {
      staff_id,
      firstname,
      middlename,
      surname,
      nationality,
      gender,
      phone,
      email,
      home_address,
      emergency_name,
      emergency_phone,
      emergency_email,
      emergency_address,
      username,
      password,
      role,
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // ✅ Check if username already exists
    const [existingUser] = await db.query("SELECT * FROM staff WHERE username = ?", [username]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // ✅ Hash the password securely
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ✅ Use async/await instead of callback for db.query
    const sql = `
      INSERT INTO staff (
        staff_id, firstname, middlename, surname, nationality, gender, phone, email, home_address,
        emergency_name, emergency_phone, emergency_email, emergency_address, username, password, role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      staff_id,
      firstname,
      middlename,
      surname,
      nationality,
      gender,
      phone,
      email,
      home_address,
      emergency_name,
      emergency_phone,
      emergency_email,
      emergency_address,
      username,
      hashedPassword, // ✅ Store the hashed password
      role,
    ]);

    return res.status(201).json({ message: "Staff added successfully", staffId: result.insertId });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const sql = "SELECT * FROM staff WHERE username = ?";

  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Wrong password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { staff_id: user.staff_id, username: user.username, role: user.role },
        process.env.JWT_KEY,
        { expiresIn: "2h" }
      );

      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      return res.status(500).json({ message: "Error during login", error: error.message });
    }
  });
});


app.get("/readschools", (req, res) => {
  const sql = "SELECT * FROM schools";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error on server" });
    return res.json(result);
  });
});

// reading all registering students api
app.get("/", (req, res) => {
  const sql = "SELECT * FROM students";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error on server" });
    return res.json(result);
  });
});

// registering students api
app.post("/students", (req, res) => {
  const {
    student_id,
    firstname,
    middlename,
    surname,
    dob,
    gender,
    medical_info,
    guardian_fullnames,
    guardian_phone,
    guardian_email,
    home_address,
    prev_school
  } = req.body;

  // Ensures required fields are present
  if (!student_id || !firstname || !surname || !dob || !gender) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const sql = `
    INSERT INTO students (
      student_id, firstname, middlename, surname, dob, gender, medical_info,
      guardian_fullnames, guardian_phone, guardian_email, home_address, prev_school
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      student_id,
      firstname,
      middlename,
      surname,
      dob,
      gender,
      medical_info,
      guardian_fullnames,
      guardian_phone,
      guardian_email,
      home_address,
      prev_school
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ message: "Student added successfully", result });
    }
  );
});

app.post("/conduct", (req, res) => {
  const sql =
    "INSERT INTO conduct (student_id, type_of_conduct, nature_of_incident, detailed_description, action_taken, teacher_staff_report, witness) VALUES (" +
    `'${req.body.student_id}',
    '${req.body.type_of_conduct}',
    '${req.body.nature_of_incident}',
    '${req.body.detailed_description}',
    '${req.body.action_taken}',
    '${req.body.teacher_staff_report}',
    '${req.body.witness}'
  );`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    return res.json({ message: "Student conduct updated successfully", result: result });
  });
});

app.post("/status", (req, res) => {
  const sql =
    "INSERT INTO status (student_id, registration_status, fee_payment_status, scholarship_financial_aid, emotional_wellbeing, peer_relationship, guardian_contact) VALUES (" +
    `'${req.body.student_id}',
    '${req.body.registration_status}',
    '${req.body.fee_payment_status}',
    '${req.body.scholarship_financial_aid}',
    '${req.body.emotional_wellbeing}',
    '${req.body.peer_relationship}',
    '${req.body.guardian_contact}'
  );`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    return res.json({ message: "Student conduct updated successfully", result: result });
  });
});

app.get("/read/:id", (req, res) => {
  const sql = "SELECT * FROM students WHERE student_id = ?";
  const id = req.params.id;
  db.query(sql,[id], (err, result) => {
    if (err) return res.json({ Message: "Error on server" });
    return res.json(result);
  });
});

app.put("/update/:id", (req, res) => {
  const studentId = req.params.id; // Gets the ID from the URL parameters

  const sql = `
    UPDATE students
    SET
      firstname = '${req.body.firstname}',
      middlename = '${req.body.middlename}',
      surname = '${req.body.surname}',
      dob = '${req.body.dob}',
      gender = '${req.body.gender}',
      medical_info = '${req.body.medical_info}',
      guardian_fullnames = '${req.body.guardian_fullnames}',
      guardian_phone = '${req.body.guardian_phone}',
      guardian_email = '${req.body.guardian_email}',
      home_address = '${req.body.home_address}',
      prev_school = '${req.body.prev_school}'
    WHERE student_id = '${studentId}';
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message }); // Send error message with 500 status
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" }); // send 404 if no rows updated
    }
    return res.json({ message: "Student updated successfully", result: result });
  })
})

// api endpoint for fetching ids
app.get('/students/ids', (req, res) => {
  const sql = "SELECT student_id FROM students";
  db.query(sql, (err, results) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
      }
      const ids = results.map(result => result.student_id);
      res.json(ids);
  });
});

app.listen(8084, () => {
  console.log("The server is working");
});
