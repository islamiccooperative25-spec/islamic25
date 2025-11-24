const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

exports.register = async (req, res) => {
  const { full_name, email, password, phone, monthly_savings } = req.body;

  try {
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      'INSERT INTO users (full_name, email, password, phone, monthly_savings) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email, role',
      [full_name, email, hashedPassword, phone, monthly_savings || 0]
    );

    const payload = {
      id: newUser.rows[0].id,
      role: newUser.rows[0].role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = {
      id: user.rows[0].id,
      role: user.rows[0].role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Don't send password back
    const userResp = { ...user.rows[0] };
    delete userResp.password;

    res.json({ token, user: userResp });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await db.query('SELECT id, full_name, email, phone, role, account_balance, monthly_savings, created_at FROM users WHERE id = $1', [req.user.id]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
