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
    location = { state, country },
    phone = req.body.phone,
    communities = {
      javascript: {
        active: true,
        completed: false,
        completedModules: 0,
          totalModules: 2
        },
        ruby : {
          active : true,
          completed : false,
          completedModules : 0,
          totalModules : 2
        }
      },
    role = 'user';

  fireBase.createUserWithEmailAndPassword(email, password)
    .then((user) => {
      const userId = user.uid;
      const userRef = ref.child('users/' + userId);
      userRef.set({
        userId,
        firstName,
        lastName,
        location,
        email,
        communities,
        role
      }).then(() => {
        res.redirect('/');
      }).catch((err) => {
        res.redirect('/register');
      });
    });
};


// signin with email and password
module.exports.login = (req, res) => {
  const email = req.body.email,
    password = req.body.password;
  fireBase.signInWithEmailAndPassword(email, password)
    .then((user) => {
      req.session.user = user;
      res.redirect('/dashboard');
    })
    .catch((error) => {
      const errorcode = error.code;
      if (errorcode === 'auth/weak-password') {
        res.redirect('/login');
      } else if (errorcode === 'auth/user-not-found') {
        res.redirect('/register');
      } else {
        res.redirect('/login');
      }
    });
};

// signOut
module.exports.signOut = (req, res) => {
  fireBase.signOut()
    .then(() => {
      req.session.user = null;
      res.redirect('/');
    })
    .catch((err) => {
      const errorMessage = err.message;
      return res.render('index', { error: errorMessage });
    });
};