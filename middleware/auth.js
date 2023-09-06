const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// 生成一个长度为32位的随机密钥
const generateSecretKey = () => { return crypto.randomBytes(32).toString('hex');}
// const secretKey = generateSecretKey(32);
const secretKey = 'Wenqi032477&';
// 生成JWT令牌
const generateToken = (payload, options = {}) => {
  const defaultOptions = { expiresIn: '1h' };
  const combinedOptions = Object.assign({}, defaultOptions, options);
  const token = jwt.sign(payload, secretKey, combinedOptions); // 使用密钥对令牌进行签名
  return token;
}
// 验证JWT令牌
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey); // 使用密钥对令牌进行验证
    return decoded;
  } catch {
    return null; // 令牌无效或已过期
  }
}
// 解码JWT令牌
const decodeToken = (token) => { return jwt.decode(token); }
// 认证中间件
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send('Unauthorized');
  }
}
// 导出生成和验证 Token 的函数以及认证中间件
module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  authenticate,
  generateSecretKey,
};