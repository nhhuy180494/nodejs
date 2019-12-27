var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var express = require('express');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

// app.use('/users', usersRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

io.on('connection', function(socket) {

    socket.on('room-joined', (room) => {
        socket.join(room);
        io.to(room).emit("user-joined", socket.id, io.sockets.adapter.rooms[room].length, Object.keys(io.sockets.adapter.rooms[room].sockets));
    });

    socket.on('signal', (toId, message) => {
        io.to(toId).emit('signal', socket.id, message);
    });

    socket.on("message", function(data) {
        io.sockets.emit("broadcast-message", socket.id, data);
    })

    socket.on('disconnect', function() {
        io.sockets.emit("user-left", socket.id);
    })
});

server.listen(3000, function() {
    console.log("Express server listening on port %d in %s mode", server.address().port, server.settings);
});