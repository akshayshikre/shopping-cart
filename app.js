var createError  = require('http-errors');
var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');
var expressHbs   = require('express-handlebars');
var mongoose     = require('mongoose');
var session      = require('express-session');
var indexRouter  = require('./routes/index');
var passport     = require('passport');
var flash        = require('connect-flash');
var validator    = require('express-validator');
var usersRouter  = require('./routes/user');
var cartRouter  = require('./routes/cart');
var mongoStore   = require('connect-mongo')(session);
var productSeeding = require('./seed/product-seeder');
var app   = express();

var options = {
  useNewUrlParser: true,
  reconnectTries: 30, // Retry up to 30 times
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
}

const connectWithRetry = () => {
  console.log('MongoDB connection with retry')
  mongoose.connect("mongodb://mongo:27017/shopping", options).then(()=>{
    console.log('MongoDB is connected')
    productSeeding()
  }).catch(err=>{
    console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
    setTimeout(connectWithRetry, 5000)
  })
}

connectWithRetry();

require('./config/passport');
// view engine setup
app.engine('.hbs', expressHbs({
  defaultLayout: 'layout',
  extname: '.hbs'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mySuperSecret',
  resave: false,
  saveUninitialized: false,
  store: new mongoStore({ 'mongooseConnection': mongoose.connection }),
  cookie: {maxAge: 180 * 60 * 1000}
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next)=>{
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
})
app.get('/notes', (req, res) => {
  res.send('Hello')
});

app.use('/cart', cartRouter);
app.use('/user', usersRouter);
app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error   = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;