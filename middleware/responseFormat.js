/*
 * @Author: 张文奇
 * @Date: 2023-09-05 10:47:25
 * @LastEditTime: 2023-09-06 10:26:09
 * @LastEditors: mac123deMacBook-Pro.local
 * @Description: 请求拦截处理
 * @FilePath: /my-express-app/middleware/responseFormat.js
 */
const mysql = require('mysql2');
const mysqlConf =  require('../config/mysql')
const { apiWhiteList } = require('../utils/variable.json')
const path = require('path');
const { verifyToken } = require('../middleware/auth.js'); 

module.exports = (req, res, next) => {
  // 请求体挂载mysql
  req.sql = mysql.createPool(mysqlConf);
  // 在 res 对象上添加一个自定义的方法，指定格式数据
  res.sendResponse = ({code = 200, data, message = 'success'}) => {
    const response = {
      code: code,
      data: data,
      message: message
    };
    res.json(response);
  };
  // 请求拦截是否登陆认证
  const authToken = req.headers["authorization"];
  if (!apiWhiteList.some(keyword => req.path.includes(keyword))) {
    if (!authToken) {
      return res.status(401).sendResponse({
        code: '401',
        data: '未登陆', 
        message: '未登陆用户'
      });
    } else {
      if (verifyToken(authToken)) {
        next();
      }else {
        return res.status(401).sendResponse({
          code: '401',
          data: '未登陆', 
          message: 'token校验失败，请重新登录'
        });
      }
    }
  } else {
    next();
  }
}