// import bcrypt from 'bcryptjs';
// import User from '../models/userSchema.js';

// const signup = async (req, res) => {
//     console.log('1');

//     try {
//         console.log('REQ BODY:', req.body);
//         console.log('x');

//         const { email, password, firstName, lastName } = req.body;
//         console.log('2');

//         if (!email || !password || !firstName || !lastName) {
//             return res.status(400).json({
//                 message: '❌ All fields are required',
//             });
//         }

//         console.log('3');

//         // ✅ Fixed: Corrected "emailId" field name
//         const existingUser = await User.findOne({ emailId: email });
//         if (existingUser) {
//             return res.status(409).json({
//                 message: '❌ User already exists with this email ID',
//             });
//         }

//         console.log('4');

//         // ✅ Hash password before saving
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         console.log('🔐 Password hashed successfully');

//         const newUser = await User.create({
//             firstName,
//             lastName,
//             emailId: email,
//             password: hashedPassword, // Store hashed password
//         });
//         if (newUser) {
//             // ✅ Remove password from response
//             const userWithoutPassword = newUser.toObject();
//             delete userWithoutPassword.password;
//             return res.status(201).json({
//                 message: '✅ New user created successfully',
//                 data: userWithoutPassword,
//             });
//         }
//     } catch (err) {
//         console.error('❌ Internal Server Error:', err);
//         return res.status(500).json({
//             message: '❌ Internal server error',
//             error: err.message,
//         });
//     }
// };
// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({
//                 message: '❌ All fields are required',
//             });
//         }
//         const existingUser = await User.findOne({ emailId: email });
//         if (!existingUser) {
//             return res.status(401).json({
//                 message: '❌ Invalid credentials',
//             });
//         }


//         // ✅ Compare password with hashed password
//         const isPasswordValid = await bcrypt.compare(password, existingUser.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({
//                 message: '❌ Invalid credentials',
//             });
//         }
//         // ✅ Remove password from response
//         const userWithoutPassword = existingUser.toObject();
//         delete userWithoutPassword.password;

//         return res.status(200).json({
//             message: '✅ Login successful',
//             data: userWithoutPassword,
//         });
//     } catch (err) {
//         console.error('❌ Internal Server Error:', err);
//         return res.status(500).json({
//             message: '❌ Internal server error',
//             error: err.message,
//         });
//     }
// }
// // export default { signup, login };
// export { signup, login };
import User from '../models/userSchema.js';
import bcrypt from 'bcryptjs';
import { mailSender } from '../utils/mailer.js';
import { createToken, getTokenData, deleteToken } from '../models/verificationTokens.js';

export const requestSignup = async (req, res) => {
  const { emailId, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const token = createToken('signup', { emailId, username, password: hashedPassword });
  const link = `http://localhost:5000/api/mongo/verify/${token}`;
  const response=await mailSender(emailId,'Verify Signup', link);
  if(response){
    res.status(200).json({ message: 'Verification email sent.' });
  }
  else{
    res.status(500).json({ message: 'Error sending verification email.' });
  }
};

export const verifySignup = async (req, res) => {
  const tokenData = getTokenData(req.params.token);
  if (!tokenData || tokenData.type !== 'signup') return res.status(400).send('Invalid or expired token');

  const { emailId, username, password } = tokenData.payload;
  await User.create({ emailId, username, password });
  deleteToken(req.params.token);
  res.send('✅ Account created successfully!');
};
