const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const passport = require('passport');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
const connectDB = require('./db.js');

// Load Config
dotenv.config({ path: './config/.env' });

// Passport config
require('./config/passport-config.js')(passport);
//Connect to DB
connectDB();

const app = express();

//Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override
app.use(methodOverride('_method'));

// Logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs.js');

// Handlebars
app.engine(
	'.hbs',
	exphbs.engine({
		helpers: {
			formatDate,
			stripTags,
			truncate,
			editIcon,
			select,
		},
		defaultLayout: 'main',
		extname: '.hbs',
	}),
);
app.set('view engine', '.hbs');

// Session middleware
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URL,
		}),
	}),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	next();
});

// Static folder
app.use(express.static(path.join(__dirname, '/public')));

// Routes
app.use('/', require('./routers/index.js'));
app.use('/auth', require('./routers/auth.js'));
app.use('/stories', require('./routers/stories.js'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
