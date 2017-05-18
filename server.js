import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import auth from './controllers/auth';
import modules from './routes/modules';
import dashboard from './routes/dashboard';
import firebase from './helpers/firebase';

dotenv.config();
const db = firebase.database();

const app = express();

// app.set('views', process.cwd() + '/views');
app.use(express.static('public'));
app.set('view engine', 'ejs');


// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Append user details to the request object
app.use((req, res, next) => {
  const user = firebase.auth().currentUser;
  if (user) {
    console.log('I am signed in, and I am getting appended');
    db.ref(`users/${user.uid}`).once('value', (snapshot) => {
      req.user = snapshot.val();
      console.log(req.user);
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

app.get('/', (req, res) => {
  res.render('index');
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/register', (req, res) => {
  res.render('register');
});
app.post('/register', auth.register);
app.post('/login', auth.login);
app.get('/signOut', auth.signOut);
app.get('/module', modules);
app.get('/dashboard', dashboard);

export default app;
