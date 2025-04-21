import pool from '../models/mysql.js';
import { mailSender } from '../utils/mailer.js';
import { generateToken, verifyToken } from '../utils/verifyToken.js';
import bcrypt from 'bcryptjs';  



export const requestUpdateSQL = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ message: '❌ All fields are required' });
    }

    // Use parameterized query to prevent SQL injection
    const [results] = await pool.query('SELECT * FROM user WHERE email_id = ?', [email]);

    if (results.length === 0) {
      return res.status(404).json({ message: '❌ User not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '❌ Incorrect old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const token = generateToken({
      email,
      updates: { password: hashedPassword },
      type: 'update'
    });

    const link = `http://localhost:5000/api/update/sql/confirm-update/${token}`;
    await mailSender(email, '🔒 Confirm Your Password Update', `Click to confirm update: ${link}`);

    res.json({ message: '📧 Verification email sent to update password' });

  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
};


export const confirmUpdateSQL = async (req, res) => {
    try {
      const { email, updates } = verifyToken(req.params.token);
      console.log('Email:', email);
      console.log('Updates:', updates);
  
      // Use parameterized query to safely update the password
      const [result] = await pool.query(
        'UPDATE cluster0.user SET password = ? WHERE email_id = ?',
        [updates.password, email]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: '❌ User not found or no changes made' });
      }
  
      res.json({ message: '✅ Password updated successfully' });
  
    } catch (err) {
      console.error('❌ Token Error:', err);
      res.status(400).json({ message: '❌ Invalid or expired token', error: err.message });
    }
  };
export const requestDeleteSQL = async (req, res) => {
  const { email } = req.body;
  const token = generateToken({ email, type: 'delete' });
  const link = `http://localhost:5000/api/update/sql/confirm-delete/${token}`;
  await mailSender(email,'Verify Delete' ,link);
  res.json({ message: '📧 Verification email sent for delete' });
};

export const confirmDeleteSQL = async (req, res) => {
  try {
    const { email } = verifyToken(req.params.token);
    pool.query(`DELETE FROM cluster0.user WHERE email_id = ${email}`, (err, result) => {
      if (err) return res.status(500).json({ message: 'SQL error', err });
      res.json({ message: '🗑️ Account deleted' });
    });
  } catch (err) {
    res.status(400).json({ message: '❌ Invalid or expired token' });
  }
};
