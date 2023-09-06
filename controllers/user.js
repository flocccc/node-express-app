
const path = require('path');
const { generateToken, verifyToken } = require('../middleware/auth.js'); 
/**
 * @swagger
 * /api/user/getRoot:
 *   get:
 *     summary: 获取用户列表
 *     description: 这是控制器函数的详细描述
 *     responses:
 *       200:
 *         description: 成功响应的描述
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exampleProperty:
 *                   type: string
 */
exports.getRoot = {
  method: 'get',
  request: (req, res) => {
    req.sql.query('SELECT * FROM users', (error, data) => {
      if (error) {
        res.status(500).send('Error fetching users from database');
      } else {
        res.sendResponse({ data });
      }
    });
  }
}

/**
 * 用户登录
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: 用户登录
 *     description: 用户使用用户名和密码进行登录认证。
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loginName:
 *                 type: string
 *                 description: 用户登录名
 *               password:
 *                 type: string
 *                 description: 用户密码
 *             example:
 *               loginName: zhang_wq
 *               password: mypassword123
 *     responses:
 *       200:
 *         description: 用户登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: 认证令牌
 *                   example: token
 *                 message:
 *                   type: string
 *                   description: 返回的消息
 *                   example: 登陆成功
 *       400:
 *         description: 用户名或密码缺失
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 错误消息
 *                   example: Username and password are required
 *       401:
 *         description: 用户名或密码错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   description: 错误码
 *                   example: 401
 *                 data:
 *                   type: string
 *                   description: 错误信息
 *                   example: 登陆失败
 *                 message:
 *                   type: string
 *                   description: 返回的消息
 *                   example: 用户或密码输入错误！
 */
exports.logIn = {
  request: (req,res) => {
    const { loginName, password } = req.body;
    if (loginName && password) {
      req.sql.query(
        `SELECT * FROM users  WHERE loginName = ?`,[loginName], (error, data) => {
      if (error) {
        res.status(500).send('Error fetching users from database');
      } else {
        const user = data[0] || null;
        if (user && user.loginName === loginName && user.password === password){
          const token = generateToken(user);
          res.sendResponse({ data: token, message: '登陆成功' });
        } else {
          res.status(401).sendResponse({
            code: '401',
            data: '登陆失败', 
            message: '用户或密码输入错误！'
          })
        }
      }
    });      
    } else {
      return res.status(400).json({ 
        error: '参数错误' 
      });      
    }
  },
  method: 'post',
}


/**
 * @swagger
 * /api/user/getUserInfo:
 *   get:
 *     summary: 获取用户信息
 *     description: 通过验证令牌或查询参数获取用户信息
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: 授权令牌
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         description: 用户ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       500:
 *         description: 查询用户失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.getUserInfo = {
  request: (req, res) => {
    const userId = req.query.id;
    if (userId) {
      req.sql.query(
        `SELECT * FROM users  WHERE objId = ?`,[Number(userId)], (error, data) => {
          if (error){
            res.status(500).sendResponse({ code: 500, data:'查询用户失败！' });
          } else {
            res.sendResponse({ data: data[0], message: '查询成功' });
          }
        })
    } else {
      const authToken = req.headers["authorization"];
      res.sendResponse({ data: verifyToken(authToken) });
    }
  },
  method: 'get',
}