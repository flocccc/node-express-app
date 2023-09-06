const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const app = express();
const responseFormat = require('./middleware/responseFormat.js');
const swagger = require('./middleware/swagger.js');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 封装统一的返回格式
app.use(responseFormat);
// 统一前缀api
app.use('/api', indexRouter);
// 增加文档插件
swagger(app);
// 404 
app.use(function (req, res, next) { next(createError(404)); });
// 其他中间件和路由设置...
app.listen(8088, () => { console.log(`Server running on port ${8088}`); });

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
