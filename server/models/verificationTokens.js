// In-memory token storage
const verificationTokens = new Map();
// token: { type, payload, expiry }

export const createToken = (type, payload) => {
  const token = Math.random().toString(36).substring(2, 15);
  verificationTokens.set(token, {
    type,
    payload,
    expiry: Date.now() + 10 * 60 * 1000 // 10 minutes
  });
  return token;
};

export const getTokenData = (token) => {
  const data = verificationTokens.get(token);
  if (!data || data.expiry < Date.now()) {
    verificationTokens.delete(token);
    return null;
  }
  return data;
};

export const deleteToken = (token) => verificationTokens.delete(token);
