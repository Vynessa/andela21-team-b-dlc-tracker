import firebase from 'firebase';
import express from 'express';
import config from './firebaseConfig.json';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import adminrouter from './routes/admin';

dotenv.config();
const app = express();

switch (process.env.NODE_ENV) {
  case 'TEST': app.set('PORT', process.env.PORT_TEST); break;
  case 'PROD': app.set('PORT', process.env.PORT_PROD); break;
  case 'DEV': app.set('PORT', process.env.PORT_DEV); break;
  default: app.set('PORT', 5000);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  const user = firebase.auth().currentUser;
  if (user) {
    db.ref(`users/${user.uid}`).on('value', (snapshot) => {
      req.user = snapshot.val();
      next();
    });
  } else {
    res.status(401).redirect('/');
  }
});
app.use('/', adminrouter);

const port = app.get('PORT');
const server = app.listen(process.env.PORT || port, () => {
  console.log('server now running at ' + process.env.PORT_TEST);
});


// load the routes
export default server;
