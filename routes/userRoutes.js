import firebase from '../helpers/firebase';
import express from 'express';

const router = express.Router();
const db = firebase.database();

const editUser = (req, res, next) => {
  const userId = firebase.auth().currentUser.uid;
  db.ref(`users/${userId}`).push(req.body)
  .then(() => {
    next();
  })
  .catch((err) => {
    return res.status(400).json(err);
  });
};

const deleteUser = (req, res) => {
  const userId = firebase.auth().currentUser.uid;
  db.ref(`users/${userId}`).remove()
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    return res.status(400).json(err);
  });
};

const getUser = (req, res) => {
  const userId = firebase.auth().currentUser.uid;
  db.ref(`users/${userId}`)
  .once('value', (snapshot) => {
    res.json(snapshot.val());
  })
  .catch((err) => {
    return res.status(400).json(err);
  });
};

const getUsers = (req, res) => {
  db.ref('users')
  .once('value', (snapshot) => {
    res.json(snapshot.val());
  })
  .catch((err) => {
    return res.status(400).json(err);
  });
};

router.get('/users', getUsers);
router.get('/', getUser);
router.put('/', editUser);
router.delete('/', deleteUser);
export default router;
