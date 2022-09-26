const express = require('express'); // ExperssJS Framework
 // Invoke express to variable for use in application

const morgan = require('morgan'); // Import Morgan Package
const mongoose = require('mongoose'); // HTTP request logger middleware for Node.js
const bodyParser = require('body-parser');
//const router = express.Router();

const path = require('path');
const cors = require('cors');
const passport = require('passport');
const config = require('./config/database');
var session = require('express-session')
 // Set default port or assign a port in enviornment

mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database);
});

mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

const app = express();
const users = require('./routes/users');
const port = process.env.PORT || 8080;
 // Morgan Middleware
app.use(morgan('dev'));




app.use(bodyParser.json()); // Body-parser middleware
//app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


//Passport middleware
//app.use(express.session()); 
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: config.secret 
}));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(cors({ origin: 'http://localhost:4200'}));
app.use('/users', users);
app.use(express.static(__dirname + '/public'));


// 
// <---------- REPLACE WITH YOUR MONGOOSE CONFIGURATION ---------->
/*
mongoose.connect('mongodb://localhost:27017/EmployeeManagement', function(err) {
    if (err) {
        console.log('Not connected to the database: ' + err); // Log to console if unable to connect to database
    } else {
        console.log('Successfully connected to MongoDB'); // Log to console if able to connect to database
    }
});
*/


app.get('/', function (req, res) {
    res.send('Invalid Endpoint');
});

// Start Server
app.listen(port, function() {
    console.log('Running the server on port ' + port); // Listen on configured port
});