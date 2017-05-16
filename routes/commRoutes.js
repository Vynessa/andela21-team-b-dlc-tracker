import firebase from 'firebase';
import express from 'express';
import config from './firebaseConfig.json';

const router = express.Router();
const db = firebase.database();

firebase.initializeApp(config);

const checkRole = (req, res, next) => {
  if (req.user.role !== 'learning facilitator') {
    return res.sendStatus(403);
  }
  next();
};

const getCommunity = (req, res) => {
  const ref = db.ref(`communities/${req.params.commId}`);
  ref.once('value', (snapshot) => {
    res.status(200).json(snapshot.val());
  })
  .catch((error) => {
    res.json(error);
  });
};

const createNewCommunity = (req, res) => {
  const ref = db.ref('communities');
  ref.push(req.body, (error) => {
    if (!error) {
      return res.json(req.body);
    }
    return res.json(error);
  });
};

const modifyCommunityProfile = (req, res, next) => {
  const ref = db.ref(`communities/${req.params.commId}`);
  ref.update(req.body, (error) => {
    if (!error) {
      return next();
    }
    return res.json(error);
  });
};

const deleteCommunity = (req, res) => {
  const ref = db.ref(`communities/${req.params.commId}`);
  ref.remove((error) => {
    if (error) {
      return res.json(error);
    }
    return res.sendStatus(200);
  });
};

router.use(checkRole);
router.get('/:commId', getCommunity);
router.post('/', createNewCommunity);
router.put('/:commId', modifyCommunityProfile, getCommunity);
router.delete('/:commId', deleteCommunity);

export default router;
