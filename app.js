const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const updatedataRouter = require('./routes/updatedata');
const updaterRouter = require('./routes/updater');
const logoutRouter = require('./routes/logout');
const linkerRouter = require('./routes/linker');
const updatepassRouter = require('./routes/updatepass');
const logviewerRouter = require('./routes/logviewer');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index.html', indexRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/updatedata', updatedataRouter);
app.use('/updater', updaterRouter);
app.use('/updatepass', updatepassRouter);
app.use('/linker', linkerRouter);
app.use('/logout', logoutRouter);
app.use('/logviewer', logviewerRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('index', {title: 'Student Portal', error: ''});
});

module.exports = app;