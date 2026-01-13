const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


// DATABASE CONNECTION
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'minor_project',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();


// MIDDLEWARE
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET_KEY || '3116';



async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}

function checkAdmin(req, res, next) {
    if (req.user.user_role !== 'admin') {
        return res.status(403).json({ message: 'Admin only action' });
    }
    next();
}


// LOGIN
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const [rows] = await pool.query(
        'SELECT user_id, password, user_role FROM users WHERE email=?',
        [email]
    );

    if (!rows.length || !(await bcrypt.compare(password, rows[0].password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { user_id: rows[0].user_id, user_role: rows[0].user_role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
});
// REGISTER USER
app.post('/users', async (req, res) => {
    try {
        const { name, email, password, phone, user_role } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if email already exists
        const [existingUser] = await pool.query(
            'SELECT user_id FROM users WHERE email=?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        const role = 'user';

        await pool.query(
            `INSERT INTO users (name, email, password, phone, user_role)
             VALUES (?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, phone, role]
        );

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// REPORTS
app.get('/reports', authenticate, async (req, res) => {
    let sql = `
        SELECT r.*, u.name AS user_name, e.name AS employee_name, c.name AS category_name
        FROM reports r
        LEFT JOIN users u ON r.user_id = u.user_id
        LEFT JOIN employees e ON r.assigned_emp_id = e.emp_id
        LEFT JOIN categories c ON r.category_id = c.category_id
    `;
    const values = [];

    if (req.user.user_role !== 'admin') {
        sql += ' WHERE r.user_id = ?';
        values.push(req.user.user_id);
    }

    sql += ' ORDER BY r.created_at DESC';
    const [rows] = await pool.query(sql, values);
    res.json(rows);
});

// Create report
app.post('/reports', authenticate, async (req, res) => {
    const { title, description, category_id, location } = req.body;

    const [result] = await pool.query(
        `INSERT INTO reports (title, description, user_id, category_id, location, status)
         VALUES (?, ?, ?, ?, ?, 'Pending')`,
        [title, description, req.user.user_id, category_id, location]
    );

    res.status(201).json({ report_id: result.insertId });
});

// Update status
app.put('/reports/:id/status', authenticate, checkAdmin, async (req, res) => {
    await pool.query(
        'UPDATE reports SET status=? WHERE report_id=?',
        [req.body.status, req.params.id]
    );
    res.json({ message: 'Status updated' });
});


// ASSIGN EMPLOYEE 
app.put('/reports/:id/assign', authenticate, checkAdmin, async (req, res) => {
    const { assigned_emp_id } = req.body;
    const reportId = req.params.id;

    if (!assigned_emp_id) {
        return res.status(400).json({ message: 'Employee ID required' });
    }

    await pool.query(
        'UPDATE reports SET assigned_emp_id=? WHERE report_id=?',
        [assigned_emp_id, reportId]
    );

    await pool.query(
        "UPDATE employees SET availability='Busy' WHERE emp_id=?",
        [assigned_emp_id]
    );

    res.json({ message: 'Employee assigned successfully' });
});


// UNASSIGN EMPLOYEE 
app.put('/reports/:id/unassign', authenticate, checkAdmin, async (req, res) => {
    const reportId = req.params.id;

    const [[row]] = await pool.query(
        'SELECT assigned_emp_id FROM reports WHERE report_id=?',
        [reportId]
    );

    if (!row || !row.assigned_emp_id) {
        return res.status(400).json({ message: 'No employee assigned' });
    }

    await pool.query(
        'UPDATE reports SET assigned_emp_id=NULL WHERE report_id=?',
        [reportId]
    );

    await pool.query(
        "UPDATE employees SET availability='Available' WHERE emp_id=?",
        [row.assigned_emp_id]
    );

    res.json({ message: 'Employee unassigned successfully' });
});


// USERS
app.get('/users', authenticate, checkAdmin, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
});


// EMPLOYEES
app.get('/employees', authenticate, checkAdmin, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM employees');
    res.json(rows);
});

app.post('/employees', authenticate, checkAdmin, async (req, res) => {
    const { name, specialization, contact_number, assigned_area } = req.body;

    const [result] = await pool.query(
        `INSERT INTO employees (name, specialization, contact_number, assigned_area, availability)
         VALUES (?, ?, ?, ?, 'Available')`,
        [name, specialization, contact_number, assigned_area]
    );

    res.status(201).json({ emp_id: result.insertId });
});


// CATEGORIES

app.get('/categories', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json(rows);
});


// START SERVER
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
