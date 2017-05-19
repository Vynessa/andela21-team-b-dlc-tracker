import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import auth from './controllers/auth';
import modules from './routes/modules';
import dashboard from './routes/dashboard';
import userCommunity from './routes/userCommRoutes'
import user from './routes/userRoutes'
import firebase from './helpers/firebase';


dotenv.config();
const db = firebase.database();

const app = express();

// Set view engine and static folders
app.use(express.static('public'));
app.set('view engine', 'ejs');


// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: '2C44-4D44-WppQ38S-UthV',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Set Global vars for messages
// app.use((req, res, next) => {
//   res.locals.success_msg = req.flash('succcess_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   req.locals.user = req.user || null;
//   next();
// });

// Append user details to the request object
app.use((req, res, next) => {
  const user = firebase.auth().currentUser;
  if (user) {
    db.ref(`users/${user.uid}`).once('value', (snapshot) => {
      req.user = snapshot.val();
      next();
    });
  } else {
    next();
  }
});

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

// const isLoggedIn = (req, res, next) => {
//   if (!req.session.isLoggedIn) {
//     res.redirect('/login');
//   }
//   next();
// };

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/register', (req, res) => {
  res.render('register');
});
app.get('/dashboard', (req, res) => {
  res.sendFile(`${__dirname}/public/html/admindashboard.html`)
});
app.use('/api/user-community/', userCommunity);
app.use('/api/user/', user);
app.post('/register', auth.register);
app.post('/login', auth.login);
app.get('/signout', auth.signOut);
app.get('/modules', modules);
app.get('/modules/:comm', modules);
app.get('/modules/:comm/:id', modules);
app.get('/dashboard', dashboard);

export default app;
