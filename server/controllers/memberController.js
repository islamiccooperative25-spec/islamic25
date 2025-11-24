const db = require('../db');

exports.getAllMembers = async (req, res) => {
  try {
    const result = await db.query('SELECT id, full_name, email, phone, role, account_balance, monthly_savings, created_at FROM users WHERE role = $1 ORDER BY created_at DESC', ['member']);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const result = await db.query('SELECT id, full_name, email, phone, role, account_balance, monthly_savings, created_at FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createMember = async (req, res) => {
  // Admin creating a member directly
  const { full_name, email, password, phone, monthly_savings } = req.body;
  // ... similar logic to register but requires admin auth ...
  // For brevity reusing logic or calling a shared service function is better, but implementing here:

  try {
      // Logic would go here
      res.status(501).json({ message: 'Use /auth/register for now or implement admin creation' });
  } catch(err) {
      res.status(500).send('Server Error');
  }
};
