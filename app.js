const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const passport = require('passport');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const connectDB = require('./db.js');

// Load Config
dotenv.config({ path: './config/.env' });

// Passport config
require('./config/passport-config.js')(passport);
//Connect to DB
connectDB();

const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Handlebars
app.engine('.hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Session middleware
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	}),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Statuc folder
app.use(express.static(path.join(__dirname, '/public')));

// Routes
app.use('/', require('./routers/index.js'));
app.use('/auth', require('./routers/auth.js'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
