import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "final_year_projectdb",
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

app.post("/staffs", (req, res) => {
  const sql =
    "INSERT INTO staff VALUE (" +
    `'${req.body.staff_id}',
    '${req.body.firstname}',
    '${req.body.middlename}',
    '${req.body.surname}',
    '${req.body.nationality}',
    '${req.body.gender}',
    '${req.body.phone}',
    '${req.body.email}',
    '${req.body.home_address}',
    '${req.body.emergency_name}',
    '${req.body.emergency_phone}',
    '${req.body.emergency_email}',
    '${req.body.emergency_address}',
    '${req.body.username}',
    '${req.body.password}',
    '${req.body.role}'
  );`;
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
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
  const sql =
    "INSERT INTO students VALUE (" +
    `'${req.body.student_id}',
    '${req.body.firstname}',
    '${req.body.middlename}',
    '${req.body.surname}',
    '${req.body.dob}',
    '${req.body.gender}',
    '${req.body.medical_info}',
    '${req.body.guardian_fullnames}',
    '${req.body.guardian_phone}',
    '${req.body.guardian_email}',
    '${req.body.home_address}',
    '${req.body.prev_school}'
  );`;
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
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


app.listen(8084, () => {
  console.log("The server is working");
});
