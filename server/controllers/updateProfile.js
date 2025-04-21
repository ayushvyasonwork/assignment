import User from '../models/userSchema.js';
import { mailSender } from '../utils/mailer.js';
import { generateToken, verifyToken } from '../utils/verifyToken.js';
import bcrypt from 'bcryptjs';
export const requestUpdateMongo = async (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.body;
  
      if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ message: '❌ All fields are required' });
      }
  
      const user = await User.findOne({ emailId: email });
      if (!user) {
        return res.status(404).json({ message: '❌ User not found' });
      }
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: '❌ Incorrect old password' });
      }
  
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      const token = generateToken({
        email,
        updates: { password: hashedNewPassword },
        type: 'update',
      });
  
      const link = `http://localhost:5000/api/update/mongo/confirm-update/${token}`;
  
      await mailSender(email, '🔒 Confirm Your Password Update', `Click to confirm update: ${link}`);
  
      res.json({ message: '📧 Verification email sent to update password' });
    } catch (err) {
      console.error('❌ Update request error:', err);
      res.status(500).json({ message: '❌ Server error' });
    }
  };

  export const confirmUpdateMongo = async (req, res) => {
    try {
      const { email, updates } = verifyToken(req.params.token);
  
      const user = await User.findOneAndUpdate(
        { emailId: email },
        updates,
        { new: true }
      );
  
      if (!user) return res.status(404).json({ message: '❌ User not found' });
  
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
  
      res.json({ message: '✅ Password updated successfully', data: userWithoutPassword });
    } catch (err) {
      console.error('❌ Confirm update error:', err);
      res.status(400).json({ message: '❌ Invalid or expired token' });
    }
  };

export const requestDeleteMongo = async (req, res) => {
  const { email } = req.body;
  const token = generateToken({ email, type: 'delete' });
  const link = `http://localhost:5000/api/update/mongo/confirm-delete/${token}`;
  await mailSender(email,'Verify Delete', link);
  res.json({ message: '📧 Verification email sent for delete' });
};

export const confirmDeleteMongo = async (req, res) => {
  try {
    const { email } = verifyToken(req.params.token);
    const result = await User.findOneAndDelete({ emailId: email });
    if (!result) return res.status(404).json({ message: 'User not found' });
    res.json({ message: '🗑️ Account deleted' });
  } catch (err) {
    res.status(400).json({ message: '❌ Invalid or expired token' });
  }
};
