import firebase from '../helpers/firebase';
import express from 'express';

const router = express.Router();
const db = firebase.database();

const userCanSubscribe = (req, res, next) => {
  const userId = firebase.auth().currentUser.uid;
  const { commName, level } = req.body;
  const ref = db.ref(`users/${userId}/communities/${commName}`);
  ref.on('value', (snapshot) => {
    const community = snapshot.val();
    if (!snapshot.exists() ||
     (community.level + 1 === level && community.completed)) {
      req.userCanSubscribe = true;
      next();
    } else {
      req.userCanSubscribe = false;
      next();
    }
  });
};

const subscribeToCommunity = (req, res) => {
  if (req.userCanSubscribe) {
    const userId = firebase.auth().currentUser.uid;
    const { commName, level } = req.body;
    const ref = db.ref(`users/${userId}/communities/${commName}`);
    const subscription = { level, module: 0, completed: false };
    ref.set(subscription)
    .then(() => {
      return res.status(200).json(subscription);
    });
  } else {
    return res.sendStatus(403);
  }
};

const unSubscribeFromCommunity = (req, res) => {
  const userId = firebase.auth().currentUser.uid;
  const { commName } = req.body;
  const ref = db.ref(`users/${userId}/communities/${commName}`);
  ref.on('value', (snapshot) => {
    if (snapshot.exists) {
      ref.remove()
      .then(() => {
        return res.json(snapshot.val());
      }, (error) => {
        return res.json(error);
      });
    } else {
      return res.sendStatus(404);
    }
  });
};

const getCommunities = (req, res) => {
  db.ref('communities')
  .once('value', (snapshot) => {
    const communities = snapshot.val();
    return res.json(communities);
  })
  .catch((err) => {
    return res.status(400).json(err);
  })
};

router.post('/', userCanSubscribe, subscribeToCommunity);
router.delete('/', unSubscribeFromCommunity);
router.get('/', getCommunities);
export default router;
