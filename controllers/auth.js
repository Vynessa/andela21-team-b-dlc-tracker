import firebase from '../helpers/firebase';

const db = firebase.database();
const ref = db.ref();
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
    communities = {};

  fireBase.createUserWithEmailAndPassword(email, password)
    .then((user) => {
      const userId = user.uid;
      const userRef = ref.child(`users/${userId}`);
      return userRef.set({
        userId,
        firstName,
        lastName,
        phone,
        state,
        country,
        email,
        password
      });
    })
    .then(res.redirect('/dashboard'))
    .catch((err) => {
      res.redirect('/');
    });
};


// signin with email and password
module.exports.login = (req, res) => {
  const email = req.body.email,
    password = req.body.password;

  fireBase.signInWithEmailAndPassword(email, password)
    .then((user) => {
      const firstName = user.firstName;
      res.redirect('/dashboard');
    })
    .catch((err) => {
      const errorMessage = err.message;
      return res.render('index', { error: errorMessage });
    });
};

// signOut
module.exports.signOut = (req, res) => {
  fireBase.signOut()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      const errorMessage = err.message;
      return res.render('index', { error: errorMessage });
    });
};
