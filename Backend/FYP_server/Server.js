import express from "express";
import mysql from "mysql"
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Middleware to authenticate and extract user info from token
function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];  // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);  // Decode the token
    req.user = decoded;  // Attach the decoded user info to the request object
    next();  // Proceed to the next middleware/route
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers["authorization"]?.split(" ")[1];

  // If token is missing
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  // Verify and decode the token
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      console.error("Error decoding token:", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Check if school_id exists in the decoded token
    if (!decoded.school_id) {
      return res.status(403).json({ message: "Token missing school_id" });
    }

    console.log("Decoded token:", decoded); // Optional: log for debugging

    // Attach the decoded data to the request object
    req.user = decoded;

    // Proceed to the next middleware/route handler
    next();
  });
};



function authorizedRoles(allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access forbidden: insufficient role" });
    }

    next();
  };
}

app.get("/active/:student_id", (req, res) => {
  const { student_id } = req.params;

  if (!student_id) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  const activeSql = `
    SELECT
      s.student_id AS student_id,
      s.firstname AS firstname,
      s.middlename AS middlename,
      s.surname AS surname,
      s.dob AS dob,
      s.gender AS gender,
      s.medical_info AS medical_info,
      st.registration_status AS registration_status,
      st.peer_relationship AS peer_relationship,
      st.fee_payment_status AS fee_payment_status,
      st.guardian_contact AS guardian_contact,
      c.type_of_conduct AS type_of_conduct,
      c.nature_of_incident AS nature_of_incident,
      c.detailed_description AS detailed_description,
      c.action_taken AS action_taken
    FROM students s
    LEFT JOIN status st ON s.student_id = st.student_id
    LEFT JOIN conduct c ON s.student_id = c.student_id
    WHERE s.student_id = ?
  `;

  db.query(activeSql, [student_id], (err, results) => {
    if (err) {
      console.error("Database error (active):", err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Active student not found" });
    }
    res.json({ source: "active", data: results });
  });
});

app.get("/inactive/:student_id", (req, res) => {
  const { student_id } = req.params;

  if (!student_id) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  const deletedSql = `
  SELECT
    ds.student_id AS student_id,
    ds.firstname AS firstname,
    ds.middlename AS middlename,
    ds.surname AS surname,
    ds.dob AS dob,
    ds.gender AS gender,
    ds.medical_info AS medical_info,
    dst.registration_status AS registration_status,
    dst.peer_relationship AS peer_relationship,
    dst.fee_payment_status AS fee_payment_status,
    dst.guardian_contact AS guardian_contact,
    dc.type_of_conduct AS type_of_conduct,
    dc.nature_of_incident AS nature_of_incident,
    dc.detailed_description AS detailed_description,
    dc.action_taken AS action_taken
  FROM deleted_students ds
  LEFT JOIN deleted_status dst ON ds.student_id = dst.student_id
  LEFT JOIN deleted_conduct dc ON ds.student_id = dc.student_id
  WHERE BINARY ds.student_id = ?
`;


  db.query(deletedSql, [student_id], (err, results) => {
    if (err) {
      console.error("Database error (deleted):", err);
      return res.status(500).json({
        error: "Internal Server Error. Could not fetch deleted student data.",
        details: err.message
      });
    }

    console.log("Deleted student query result:", results);

    // Check only if the base student data exists (from deleted_students)
    const found = results.some(row => row.student_id);

    if (!found) {
      return res.status(404).json({ message: "Deleted student not found" });
    }

    res.json({ source: "deleted", data: results });
  });
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

// Fetch all schools
app.get("/readschools", (req, res) => {
  db.query("SELECT * FROM schools", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Fetch all school IDs
app.get("/school", (req, res) => {
  db.query("SELECT school_id FROM schools", (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(results);
  });
});


app.post("/staffs", async (req, res) => {
  console.log('Incoming request body:', req.body);

  const { staff_id, firstname, middlename, surname, nationality, gender, school_id, phone, email, home_address, emergency_name, emergency_phone, emergency_email, emergency_address, username, password, role } = req.body;

  // Validation checks
  if (!staff_id || !firstname || !surname || !nationality || !gender || !school_id || !phone || !email || !home_address ||  !username || !password || !role) {
    return res.status(400).send({ message: "All fields must be filled" });
  }

  try {
    // Check if school exists
    const school = await db.query("SELECT * FROM schools WHERE school_id = ?", [school_id]);
    if (school.length === 0) {
      return res.status(400).send({ message: "School not found" });
    }

    // Check if username is already taken
    const userExists = await db.query("SELECT * FROM staff WHERE username = ?", [username]);
    if (userExists.length > 0) {
      return res.status(409).send({ message: "Username already taken" });
    }

    // Hash the password before saving to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert staff data with the hashed password
    const query = "INSERT INTO staff (staff_id, firstname, middlename, surname, nationality, gender, school_id, phone, email, home_address, emergency_name, emergency_phone, emergency_email, emergency_address, username, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await db.query(query, [staff_id, firstname, middlename, surname, nationality, gender, school_id, phone, email, home_address, emergency_name, emergency_phone, emergency_email, emergency_address, username, hashedPassword, role]);

    res.status(201).send({ message: "Staff created successfully" });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/new-staff", verifyToken, (req, res) => {
  console.log('Incoming request body:', req.body);

  const {
    staff_id, firstname, middlename, surname, nationality, gender, phone,
    email, home_address, emergency_name, emergency_phone, emergency_email,
    emergency_address, username, password, role
  } = req.body;

  const school_id = req.user?.school_id; // From verifyToken middleware

  if (!staff_id || !firstname || !surname || !nationality || !gender || !school_id || !phone ||
      !email || !home_address || !username || !password || !role) {
    return res.status(400).send({ message: "All fields must be filled" });
  }

  // First check if the school exists
  db.query("SELECT * FROM schools WHERE school_id = ?", [school_id], (err, schoolResults) => {
    if (err) {
      console.error("DB error checking school:", err);
      return res.status(500).send({ message: "Internal Server Error" });
    }

    if (schoolResults.length === 0) {
      return res.status(400).send({ message: "School not found" });
    }

    // Now check if username already exists
    db.query("SELECT * FROM staff WHERE username = ?", [username], async (err, userResults) => {
      if (err) {
        console.error("DB error checking username:", err);
        return res.status(500).send({ message: "Internal Server Error" });
      }

      if (userResults.length > 0) {
        console.log("Username already taken:", username);
        return res.status(409).send({ message: "Username already taken" });
      }

      // Username not taken, hash the password and insert
      try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const insertQuery = `INSERT INTO staff (
          staff_id, firstname, middlename, surname, nationality, gender,
          school_id, phone, email, home_address, emergency_name,
          emergency_phone, emergency_email, emergency_address, username,
          password, role
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(insertQuery, [
          staff_id, firstname, middlename, surname, nationality, gender,
          school_id, phone, email, home_address, emergency_name,
          emergency_phone, emergency_email, emergency_address, username,
          hashedPassword, role
        ], (err, insertResult) => {
          if (err) {
            console.error("DB error inserting staff:", err);
            return res.status(500).send({ message: "Internal Server Error" });
          }

          res.status(201).send({ message: "Staff created successfully" });
        });
      } catch (hashError) {
        console.error("Password hashing error:", hashError);
        return res.status(500).send({ message: "Internal Server Error" });
      }
    });
  });
});


app.put("/update-password", (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res.status(400).send({ message: "Username and new password are required." });
  }

  db.query("SELECT * FROM staff WHERE username = ?", [username], (err, results) => {
    if (err) {
      console.error("Error finding user:", err);
      return res.status(500).send({ message: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: "Username not found." });
    }

    // User found, hash password
    const saltRounds = 10;

    bcrypt.hash(newPassword, saltRounds, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error("Error hashing password:", hashErr);
        return res.status(500).send({ message: "Error hashing password" });
      }

      // Update password
      db.query("UPDATE staff SET password = ? WHERE username = ?", [hashedPassword, username], (updateErr) => {
        if (updateErr) {
          console.error("Error updating password:", updateErr);
          return res.status(500).send({ message: "Error updating password" });
        }

        res.status(200).send({ message: "Password updated successfully." });
      });
    });
  });
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ status: "error", message: "Username and password are required" });
  }

  // Check if the user exists in the database
  const sql = `
    SELECT staff.*, schools.school_name 
    FROM staff 
    JOIN schools ON staff.school_id = schools.school_id 
    WHERE staff.username = ?
  `;

  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ status: "error", message: "Database error", error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ status: "error", message: "User does not exist" });
    }

    const user = results[0]; // Retrieve user data with school_name from the join

    // Check if the staff account is active
    if (user.isActive === 0) {
      return res.status(403).json({
        status: "error",
        message: "Your account is inactive. Please contact the administrator."
      });
    }

    try {
      // Compare provided password with hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ status: "error", message: "Wrong password" });
      }

      // Generate JWT token with user details, including school_name
      const token = jwt.sign(
        {
          staff_id: user.staff_id,
          username: user.username,
          role: user.role,
          school_id: user.school_id,
          school_name: user.school_name
        },
        process.env.JWT_KEY,
        { expiresIn: "2h" }
      );

      // Respond with token and basic user info
      return res.status(200).json({
        status: "success",
        message: "Login successful",
        token,
        user: {
          staff_id: user.staff_id,
          username: user.username,
          role: user.role,
          school_id: user.school_id,
          school_name: user.school_name
        }
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ status: "error", message: "Error during login", error: error.message });
    }
  });
});

app.get("/students/count", authenticateUser, (req, res) => {
  const schoolId = req.user.school_id;
  console.log("Received School ID:", schoolId);

  const sql = "SELECT COUNT(*) AS count FROM students WHERE school_id = ?";
  console.log("SQL Query:", sql, [schoolId]);

  db.query(sql, [schoolId], (err, results) => {
    if (err) {
      console.error("Error fetching student count:", err);
      return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }

    console.log("Query Result (results):", results);

    if (results && results.length > 0) {
      res.json({ count: results[0].count });
    } else {
      res.status(200).json({ count: 0, message: "No students found for this school" });
    }
  });
});

app.get("/schools/count", (req, res) => {
  const sql = "SELECT COUNT(*) AS count FROM schools";
  console.log("SQL Query:", sql);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching school count:", err);
      return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }

    console.log("Query Result (results):", results);

    if (results && results.length > 0) {
      res.json({ count: results[0].count });
    } else {
      res.json({ count: 0 });
    }
  });
});

app.get("/staff/count", (req, res) => {
  const sql = "SELECT COUNT(*) AS count FROM staff";
  console.log("SQL Query:", sql);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching staff count:", err);
      return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }

    console.log("Query Result (results):", results);

    if (results && results.length > 0) {
      res.json({ count: results[0].count });
    } else {
      res.json({ count: 0 });
    }
  });
});

// reading all registered students api
app.get("/", authenticateUser, (req, res) => {
  const schoolId = req.user.school_id; // Extract `school_id` from logged-in user's token

    const sql = "SELECT * FROM students WHERE school_id = ?";
    
    db.query(sql, [schoolId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error on server", error: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "No students found for this school" });
        }

        return res.json(result);
  });
});

app.get("/students-with-negative-conduct", authenticateUser, (req, res) => {
  const schoolId = req.user.school_id; // Logged-in user's school_id

  const sql = `
    SELECT 
      students.*, 
      conduct.* 
    FROM 
      students 
    JOIN 
      conduct 
      ON students.student_id = conduct.student_id 
    WHERE 
      students.school_id = ? 
      AND conduct.type_of_conduct = 'negative'
  `;

  db.query(sql, [schoolId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error on server", error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "No students with negative conduct found for this school" });
    }

    return res.json(result);
  });
});


app.get("/staff-view", authenticateUser, (req, res) => {
  const schoolId = req.user.school_id; // Extract `school_id` from logged-in user's token

    const sql = "SELECT * FROM staff WHERE school_id = ?";
    
    db.query(sql, [schoolId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error on server", error: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "No staff found for this school" });
        }

        return res.json(result);
  });
});


app.post("/students", verifyToken, (req, res) => {
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

  const school_id = req.user.school_id; // Extracted from JWT

  const sql = `
    INSERT INTO students 
    (student_id, firstname, middlename, surname, dob, gender, medical_info, guardian_fullnames, guardian_phone, guardian_email, home_address, prev_school, school_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
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
    prev_school,
    school_id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting student:", err);
      return res.status(500).json({ error: "Student Number Exists" });
    }
    return res.status(201).json({ message: "Student created successfully", studentId: student_id });
  });
});


app.get('/conduct-details', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Invalid or missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const SECRET_KEY = process.env.JWT_KEY;
    if (!SECRET_KEY) {
      console.error('JWT_KEY environment variable not set!');
      return res.status(500).json({ status: 'error', message: 'Server configuration error' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error("JWT verification failed:", err);
        return res.status(403).json({ status: 'error', message: 'Invalid or expired token' });
      }

      const schoolId = decoded.school_id;

      const query = `
        SELECT
          st.*,
          c.*,
          s.*
        FROM students s
        LEFT JOIN conduct c ON s.student_id = c.student_id
        LEFT JOIN status st ON s.student_id = st.student_id
        WHERE s.school_id = ?
          AND st.registration_status != 'N/A'
          AND st.fee_payment_status != 'N/A'
          AND c.type_of_conduct != 'N/A'
          AND c.nature_of_incident != 'N/A'
          AND c.action_taken != 'N/A'
      `;

      db.query(query, [schoolId], (dbErr, results) => {
        if (dbErr) {
          console.error('Database query failed:', dbErr);
          return res.status(500).json({ status: 'error', message: 'Database query failed' });
        }
        res.status(200).json({ status: 'success', data: results });
      });
    });

  } catch (err) {
    // This catch block handles errors that occur *before* the jwt.verify callback
    console.error("Error during token processing:", err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

app.get('/conduct-details/count', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Invalid or missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const SECRET_KEY = process.env.JWT_KEY;
    if (!SECRET_KEY) {
      console.error('JWT_KEY environment variable not set!');
      return res.status(500).json({ status: 'error', message: 'Server configuration error' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error("JWT verification failed:", err);
        return res.status(403).json({ status: 'error', message: 'Invalid or expired token' });
      }

      const schoolId = decoded.school_id;

      const query = `
        SELECT COUNT(*) AS student_count
        FROM students s
        LEFT JOIN conduct c ON s.student_id = c.student_id
        LEFT JOIN status st ON s.student_id = st.student_id
        WHERE s.school_id = ?
          AND st.registration_status != 'N/A'
          AND st.fee_payment_status != 'N/A'
          AND c.type_of_conduct != 'N/A'
          AND c.nature_of_incident != 'N/A'
          AND c.action_taken != 'N/A'
      `;

      db.query(query, [schoolId], (dbErr, results) => {
        if (dbErr) {
          console.error('Database query failed:', dbErr);
          return res.status(500).json({ status: 'error', message: 'Database query failed' });
        }
        const count = results[0].student_count;
        res.status(200).json({ status: 'success', count });
      });
    });

  } catch (err) {
    console.error("Error during token processing:", err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


app.get("/staff/role-counts", (req, res) => {
  const sql = `
    SELECT role, COUNT(*) AS count
    FROM staff
    GROUP BY role
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching role counts:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(results);
  });
});

app.get("/schools/type-counts", (req, res) => {
  // SQL query to count schools by type and system
  const sql = `
    SELECT 
      school_type, 
      school_system, 
      COUNT(*) AS count 
    FROM schools 
    GROUP BY school_type, school_system;
  `;

  console.log("SQL Query:", sql); // You can log the query for debugging purposes

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching school type counts:", err);
      return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }

    console.log("Query Result (results):", results); // Check the returned results

    if (results && results.length > 0) {
      res.json(results); // Send the results as JSON to the frontend
    } else {
      res.status(200).json([]); // If no results found, return an empty array
    }
  });
});


app.post("/conduct", (req, res) => {
  const {
    student_id,
    type_of_conduct,
    nature_of_incident,
    detailed_description,
    action_taken,
    teacher_staff_report,
    witness
  } = req.body;

  const sql = `
    INSERT INTO conduct (
      student_id, type_of_conduct, nature_of_incident,
      detailed_description, action_taken, teacher_staff_report, witness
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    student_id,
    type_of_conduct,
    nature_of_incident,
    detailed_description,
    action_taken,
    teacher_staff_report,
    witness
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB Error:", err); // log detailed error
      return res.status(500).json({ error: err.message });
    }
    return res.json({ message: "Student conduct recorded successfully", result });
  });
});


app.post("/status", (req, res) => {
  const {
    student_id,
    registration_status,
    fee_payment_status,
    scholarship_financial_aid,
    emotional_wellbeing,
    peer_relationship,
    guardian_contact
  } = req.body;

  const sql = `
    INSERT INTO status (
      student_id, registration_status, fee_payment_status, 
      scholarship_financial_aid, emotional_wellbeing, 
      peer_relationship, guardian_contact
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      registration_status = VALUES(registration_status),
      fee_payment_status = VALUES(fee_payment_status),
      scholarship_financial_aid = VALUES(scholarship_financial_aid),
      emotional_wellbeing = VALUES(emotional_wellbeing),
      peer_relationship = VALUES(peer_relationship),
      guardian_contact = VALUES(guardian_contact)
  `;

  db.query(sql, [
    student_id,
    registration_status,
    fee_payment_status,
    scholarship_financial_aid,
    emotional_wellbeing,
    peer_relationship,
    guardian_contact
  ], (err, result) => {
    if (err) {
      console.error("Error with query:", err);
      return res.status(500).json({ error: err.message });
    }
    return res.json({ message: "Student status inserted or updated successfully", result });
  });
});


app.get("/conduct-details/nature-counts", (req, res) => {
  // Check if the Authorization header is present and starts with 'Bearer '
  const token = req.headers['authorization'];
  
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(400).json({ message: 'Authorization token is missing or malformed' });
  }
  
  const parts = token.split(' ');  // Now it's safe to split, as we ensured the token exists and is properly formatted
  const bearerToken = parts[1];    // Extract the actual token
  
  // Decode the JWT token to get the user's data
  let decodedToken;
  try {
    decodedToken = jwt.decode(bearerToken); // Decode the token without verifying (just to extract data)
    if (!decodedToken || !decodedToken.school_id) {
      return res.status(400).json({ message: 'Invalid token or school_id not found in token' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failed to decode token', error: err.message });
  }

  const userSchoolId = decodedToken.school_id; // Extract school_id from the decoded token

  // SQL query to get the conduct counts for the students in the same school as the logged-in user
  const sql = `
    SELECT c.nature_of_incident, COUNT(*) AS incident_count
    FROM conduct c
    JOIN students s ON c.student_id = s.student_id
    WHERE s.school_id = ? 
    GROUP BY c.nature_of_incident
  `;

  // Run the SQL query to fetch the incident counts for students from the same school
  db.query(sql, [userSchoolId], (err, result) => {
    if (err) {
      console.error("Error with query:", err);
      return res.status(500).json({ error: err.message });
    }

    console.log("Filtered Incident Counts:", result); // Log the result for debugging

    // Send the result back to the client (it should be an array of incident counts by nature_of_incident)
    res.json(result);
  });
});


app.get("/staff-reading/:id", (req, res) => {
  const sql = `
    SELECT 
      students.*,
      status.*,
      conduct.*
    FROM students
    LEFT JOIN status ON students.student_id = status.student_id
    LEFT JOIN conduct ON students.student_id = conduct.student_id
    WHERE students.student_id = ?
  `;
  const id = req.params.id;
  db.query(sql,[id], (err, result) => {
    if (err) return res.json({ Message: "Error on server" });
    return res.json(result);
  });
});

app.get("/read/:id", (req, res) => {
  const sql = `
    SELECT * FROM students WHERE student_id = ?
  `;
  const id = req.params.id;
  db.query(sql,[id], (err, result) => {
    if (err) return res.json({ Message: "Error on server" });
    return res.json(result);
  });
});

app.get("/read-schools/:id", (req, res) => {
  const schoolId = req.params.id;
  const sql = 'SELECT * FROM schools WHERE school_id = ?';

  db.query(sql, [schoolId], (err, result) => {
    if (err) {
      console.error('Error fetching school:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result);
    }
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

app.get("/read-staff/:id", (req, res) => {
  const id = req.params.id;

  const sql = `SELECT * FROM staff WHERE staff_id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ Message: "Error on server" });

    if (result.length === 0) {
      return res.status(404).json({ Message: "Staff not found" });
    }

    return res.status(200).json(result[0]); // Assuming one result
  });
});

app.get("/staff-read/:id", (req, res) => {
  const id = req.params.id;

  const sql = `SELECT * FROM staff WHERE staff_id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ Message: "Error on server" });

    if (result.length === 0) {
      return res.status(404).json({ Message: "Staff not found" });
    }

    return res.status(200).json(result[0]); // Assuming one result
  });
});


app.put("/update-staff/:id", async (req, res) => {
  try {
    const staffId = req.params.id;
    const {
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
      role
    } = req.body;

    let hashedPassword = null;
    if (password && password.trim() !== '') {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const sql = hashedPassword
      ? `UPDATE staff SET
          firstname = ?,
          middlename = ?,
          surname = ?,
          nationality = ?,
          gender = ?,
          phone = ?,
          email = ?,
          home_address = ?,
          emergency_name = ?,
          emergency_phone = ?,
          emergency_email = ?,
          emergency_address = ?,
          username = ?,
          password = ?,
          role = ?
        WHERE staff_id = ?`
      : `UPDATE staff SET
          firstname = ?,
          middlename = ?,
          surname = ?,
          nationality = ?,
          gender = ?,
          phone = ?,
          email = ?,
          home_address = ?,
          emergency_name = ?,
          emergency_phone = ?,
          emergency_email = ?,
          emergency_address = ?,
          username = ?,
          role = ?
        WHERE staff_id = ?`;

    const params = hashedPassword
      ? [
          firstname, middlename, surname, nationality, gender,
          phone, email, home_address, emergency_name,
          emergency_phone, emergency_email, emergency_address,
          username, hashedPassword, role, staffId
        ]
      : [
          firstname, middlename, surname, nationality, gender,
          phone, email, home_address, emergency_name,
          emergency_phone, emergency_email, emergency_address,
          username, role, staffId
        ];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Staff not updated" });
      }
      return res.json({ message: "Staff updated successfully", result });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Password field empty' });
  }
});

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

app.patch("/toggle-staff-status/:id", (req, res) => {
  const staffId = req.params.id;
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    return res.status(400).send('Invalid "isActive" value. It must be true or false.');
  }

  const sql = 'UPDATE staff SET isActive = ? WHERE staff_id = ?';
  db.query(sql, [isActive, staffId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Staff not found');
    }

    res.send({ message: `Staff ${isActive ? 'activated' : 'deactivated'} successfully` });
  });
});

app.delete('/delete-school/:id', (req, res) => {
  const schoolId = req.params.id;
  const sql = 'DELETE FROM schools WHERE school_id = ?';

  db.query(sql, [schoolId], (err, result) => {
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ error: 'Failed to delete school' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.json({ message: 'School deleted successfully' });
  });
});

app.delete('/staff-delete/:id', (req, res) => {
  const staff_id = req.params.id;
  const sql = 'DELETE FROM staff WHERE staff_id = ?';

  db.query(sql, [staff_id], (err, result) => {
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ error: 'Failed to delete staff' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json({ message: 'Staff deleted successfully' });
  });
});

app.delete("/delete/:id", (req, res) => {
  const student_id = req.params.id;
  console.log("Received DELETE for student_id:", student_id);

  if (!student_id) {
    return res.status(400).json({ error: "student_id is required." });
  }

  // Get a connection from the pool
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting DB connection:", err);
      return res.status(500).json({ error: "Database connection failed." });
    }

    // Start the transaction
    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error("Transaction start failed:", err);
        return res.status(500).json({ error: "Transaction start failed." });
      }

      // Step 1: Backup student data
      const backupStudent = `
        INSERT INTO deleted_students
        (student_id, firstname, school_id, middlename, surname, dob, gender, medical_info, guardian_fullnames, guardian_phone, guardian_email, home_address, prev_school)
        SELECT student_id, firstname, school_id, middlename, surname, dob, gender, medical_info, guardian_fullnames, guardian_phone, guardian_email, home_address, prev_school
        FROM students WHERE student_id = ?
      `;
      connection.query(backupStudent, [student_id], (err) => {
        if (err) return rollback(err);

        // Step 2: Backup and delete status data
        const backupStatus = `
          INSERT INTO deleted_status 
          (student_id, registration_status, fee_payment_status, scholarship_financial_aid, emotional_wellbeing, peer_relationship, guardian_contact)
          SELECT student_id, registration_status, fee_payment_status, scholarship_financial_aid, emotional_wellbeing, peer_relationship, guardian_contact
          FROM status WHERE student_id = ?
        `;
        const deleteStatus = `DELETE FROM status WHERE student_id = ?`;

        connection.query(backupStatus, [student_id], (err) => {
          if (err) return rollback(err);

          connection.query(deleteStatus, [student_id], (err) => {
            if (err) return rollback(err);

            // Step 3: Backup and delete conduct data
            const backupConduct = `
              INSERT INTO deleted_conduct 
              (student_id, type_of_conduct, nature_of_incident, detailed_description, action_taken, teacher_staff_report, witness)
              SELECT student_id, type_of_conduct, nature_of_incident, detailed_description, action_taken, teacher_staff_report, witness
              FROM conduct WHERE student_id = ?
            `;
            const deleteConduct = `DELETE FROM conduct WHERE student_id = ?`;

            connection.query(backupConduct, [student_id], (err) => {
              if (err) return rollback(err);

              connection.query(deleteConduct, [student_id], (err) => {
                if (err) return rollback(err);

                // Finally, delete the student record
                const deleteStudent = `DELETE FROM students WHERE student_id = ?`;

                connection.query(deleteStudent, [student_id], (err) => {
                  if (err) return rollback(err);

                  // Commit the transaction
                  connection.commit((err) => {
                    if (err) return rollback(err);
                    connection.release();
                    res.status(200).json({ message: "Student and related records deleted and backed up successfully." });
                  });
                });
              });
            });
          });
        });
      });

      // Rollback function in case of error
      function rollback(error) {
        connection.rollback(() => {
          connection.release();
          console.error("Rollback due to error:", error);
          res.status(500).json({ error: "An error occurred during deletion and backup.", detail: error.message });
        });
      }
    });
  });
});


app.listen(8084, () => {
  console.log("The server is working");
});
