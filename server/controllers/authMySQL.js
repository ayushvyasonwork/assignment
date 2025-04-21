import pool from '../models/mysql.js';
import bcrypt from 'bcryptjs';
import { mailSender } from '../utils/mailer.js';
import { createToken, getTokenData, deleteToken } from '../models/verificationTokens.js';

export const requestSignup = async (req, res) => {
  const { emailId, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const token = createToken('signup-mysql', { emailId, username, password: hashedPassword });
  const link = `http://localhost:5000/api/mysql/verify/${token}`;
  await mailSender(emailId, link);
  res.status(200).json({ message: 'Verification email sent.' });
};

export const verifySignup = async (req, res) => {
  const data = getTokenData(req.params.token);
  if (!data || data.type !== 'signup-mysql') return res.status(400).send('Invalid or expired token');

  const { emailId, username, password } = data.payload;
  await pool.query('INSERT INTO users (email_id, username, password) VALUES (?, ?, ?)', [emailId, username, password]);
  deleteToken(req.params.token);
  res.send('✅ MySQL account created successfully!');
};
