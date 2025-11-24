const db = require('../db');

exports.applyLoan = async (req, res) => {
  const { amount, purpose, duration_months } = req.body;
  try {
    const newLoan = await db.query(
      'INSERT INTO loans (user_id, amount, purpose, duration_months) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, amount, purpose, duration_months]
    );
    res.json(newLoan.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllLoans = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT l.*, u.full_name, u.email
      FROM loans l
      JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMyLoans = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM loans WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateLoanStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!['pending', 'approved', 'rejected', 'paid'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const result = await db.query(
      'UPDATE loans SET status = $1, approved_at = CASE WHEN $1 = \'approved\' THEN NOW() ELSE approved_at END WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
