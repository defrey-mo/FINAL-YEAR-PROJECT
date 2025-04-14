import express from "express";
import mysql from "mysql"
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
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  // Decode the token
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      console.error("Error decoding token:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    console.log("Decoded token:", decoded); // Log the decoded token to check its contents

    // Attach the decoded token to the request
    req.user = decoded;  // Now `req.user` will have the decoded token, including the `school_id`
    next(); // Proceed to the next middleware/route handler
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
          school_id: user.school_id, // Ensures restricted access
          school_name: user.school_name // Add school_name from JOIN
        },
        process.env.JWT_KEY,
        { expiresIn: "2h" } // Token expires in 2 hours
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
          school_name: user.school_name // Include school_name in the response
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
      return res.status(500).json({ error: "Database error" });
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
  const { 
    student_id, 
    registration_status, 
    fee_payment_status, 
    scholarship_financial_aid, 
    emotional_wellbeing, 
    peer_relationship, 
    guardian_contact 
  } = req.body;

  // Map frontend values to backend ENUM values
  const registrationStatusMap = {
    positive: 'Fully Registered',
    negative: 'Pending',
    never: 'Not Registered',
  };

  const feePaymentStatusMap = {
    positive: 'Fully Paid',
    negative: 'Partially Paid',
    never: 'Not Paid',
  };

  const scholarshipFinancialAidMap = {
    positive: 'Yes',
    negative: 'No',
  };

  const emotionalWellbeingMap = {
    vw: 'Happy',
    ww: 'Stressed',
    pn: 'Anxious',
    dete: 'Depressed',
  };

  const peerRelationshipMap = {
    positive: 'Good',
    negative: 'Average',
    never: 'Poor',
  };

  // Map the frontend values to the correct values for database
  const mappedRegistrationStatus = registrationStatusMap[registration_status] || registration_status;
  const mappedFeePaymentStatus = feePaymentStatusMap[fee_payment_status] || fee_payment_status;
  const mappedScholarshipFinancialAid = scholarshipFinancialAidMap[scholarship_financial_aid] || scholarship_financial_aid;
  const mappedEmotionalWellbeing = emotionalWellbeingMap[emotional_wellbeing] || emotional_wellbeing;
  const mappedPeerRelationship = peerRelationshipMap[peer_relationship] || peer_relationship;
  const sql = `
    INSERT INTO status 
    (student_id, registration_status, fee_payment_status, scholarship_financial_aid, emotional_wellbeing, peer_relationship, guardian_contact) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(sql, [
    student_id, 
    mappedRegistrationStatus, 
    mappedFeePaymentStatus, 
    mappedScholarshipFinancialAid, 
    mappedEmotionalWellbeing, 
    mappedPeerRelationship, 
    guardian_contact
  ], (err, result) => {
    if (err) {
      console.error("Error with query:", err);
      return res.status(500).json({ error: err.message });
    }
    return res.json({ message: "Student status updated successfully", result });
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
