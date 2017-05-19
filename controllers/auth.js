import firebase from '../helpers/firebase';

const db = firebase.database();
const ref = db.ref();
const usersRef = ref.child('users');
const fireBase = firebase.auth();

// register user
module.exports.register = (req, res) => {
  const firstName = req.body.firstName,
    lastName = req.body.lastName,
    email = req.body.email,
    password = req.body.password,
    state = req.body.state,
    country = req.body.country,
    phone = req.body.phone,
    communities = {},
    role = 'user';

  fireBase.createUserWithEmailAndPassword(email, password)
    .then((user) => {
      // const userId = user.uid;
      const userId = user.uid;
      const userRef = ref.child('users/' + userId);
      userRef.set({
        userId,
        firstName,
        lastName,
        state,
        country,
        email,
        communities,
        role
      }).then(() => {
        res.redirect('/dashboard');
      }).catch((err) => {
        res.redirect('/register');
      });
    });
};


// signin with email and password
module.exports.login = (req, res) => {
  const email = req.body.email,
    password = req.body.password;
  
  console.log(req.body);
  fireBase.signInWithEmailAndPassword(email, password)
    .then((user) => {
      res.redirect('/dashboard');
    })
    .catch((error) => {
      const errorcode = error.code;
      const errorMessage = error.message;
      console.log('HARARAR');
      console.log(errorcode);
      if (errorcode === 'auth/weak-password') {
        console.log('HERE HRERE');
        res.redirect('/login');
      } else if (errorcode === 'auth/user-not-found') {
        res.redirect('/register');
      } else {
        console.log('HERE');
        res.redirect('/login');
      }
    });
};

// signOut
module.exports.signOut = (req, res) => {
  fireBase.signOut()
    .then(() => {
      res.redirect('/index');
    })
    .catch((err) => {
      const errorMessage = err.message;
      return res.render('index', { error: errorMessage });
    });
};
