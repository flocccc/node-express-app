const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
router.get('/', function(req, res, next) { res.render('index', { title: 'Express' });});
// 读取控制器文件夹中的文件
const controllersPath = path.join(__dirname, '..', 'controllers');
// 读取控制器文件夹中的文件
const controllers = fs.readdirSync(controllersPath);
// 自动生成路由
controllers.forEach((controller) => {
  const controllerModule = require(path.join(controllersPath, controller));
  const controllerName = controller.split('.')[0];
  // 根据文件名自动匹配路由和控制器函数
  Object.keys(controllerModule).forEach(item => {
    const { method, request } =  controllerModule[item];
    // console.log(`/${controllerName}/${item}`,controllerModule[item])
    router[method](`/${controllerName}/${item}`, request);
  })
});

module.exports = router;
