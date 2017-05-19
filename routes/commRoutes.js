import firebase from 'firebase';
import express from 'express';
import config from './firebaseConfig.json';

const router = express.Router();
const db = firebase.database();

firebase.initializeApp(config);

const checkRole = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.sendStatus(403);
  }
  next();
};

const getCommunity = (req, res) => {
  const ref = db.ref(`communities/${req.params.commName}`);
  ref.once('value', (snapshot) => {
    res.status(200).json(snapshot.val());
  })
  .catch((error) => {
    res.json(error);
  });
};

const createNewCommunity = (req, res) => {
  const ref = db.ref(`communities/${req.params.commName}`);
  ref.update(req.body, (error) => {
    if (!error) {
      return res.json(req.body);
    }
    return res.json(error);
  });
};

const modifyCommunityProfile = (req, res, next) => {
  const ref = db.ref(`communities/${req.params.commName}`);
  ref.update(req.body, (error) => {
    if (!error) {
      return next();
    }
    return res.json(error);
  });
};

const deleteCommunity = (req, res) => {
  const ref = db.ref(`communities/${req.params.commName}`);
  ref.remove((error) => {
    if (error) {
      return res.json(error);
    }
    return res.sendStatus(200);
  });
};

router.use(checkRole);
router.get('/:commName', getCommunity);
router.post('/:commName', createNewCommunity);
router.put('/:commName', modifyCommunityProfile, getCommunity);
router.delete('/:commName', deleteCommunity);

export default router;
