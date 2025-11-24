const db = require('../db');

exports.requestWithdrawal = async (req, res) => {
  const { amount, reason } = req.body;
  try {
    // Check balance first? (Simplification: assuming unlimited balance or checking later)
    const newWithdrawal = await db.query(
      'INSERT INTO withdrawals (user_id, amount, reason) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, amount, reason]
    );
    res.json(newWithdrawal.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllWithdrawals = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT w.*, u.full_name, u.email
      FROM withdrawals w
      JOIN users u ON w.user_id = u.id
      ORDER BY w.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMyWithdrawals = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM withdrawals WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateWithdrawalStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const result = await db.query(
      'UPDATE withdrawals SET status = $1, processed_at = CASE WHEN $1 != \'pending\' THEN NOW() ELSE processed_at END WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }

    // Logic to deduct from balance if approved could go here

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
