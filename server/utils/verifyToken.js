import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || '123';

export const generateToken = (data) => jwt.sign(data, secret, { expiresIn: '15m' });

export const verifyToken = (token) => jwt.verify(token, secret);
