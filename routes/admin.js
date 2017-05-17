import firebase from 'firebase';
import express from 'express';
import config from './firebaseConfig.json';

const router = express.Router();
const db = database.firebase();

// admin

const checkRole = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send("FORBIDDEN") ;
  }
  next();
}

const getModule = (req, res) => {
  const ref = db.ref(`modules/${req.params.modId}`);
  ref.once('value', (snapshot) => {
    res.status(200).json(snapshot.val());
  })
  .catch((error) => {
    res.json(error);
  });
};


const createModule = (req, res) => {
  const ref = db.ref('modules');
  ref.push(req.body, (error) => {
    if (!error) {
      return res.json(req.body);
    }
    return res.json(error);
  });
};

//const modifyModule

const deleteModule = (req, res) => {
  const ref = db.ref(`modules/${req.params.modId}`);
  ref.remove((error) => {
    if (error) {
      return res.json(error);
    }
    return res.sendStatus(200);
  });


const activateDeactivateUser = (req, res) => {
    const {userId, commName} = req.body;
    const ref = db.ref(`users/${userId}/communities/${commName}`);
    ref.once('value', (snapshot) => {
      if(snapshot.val().active) {
        req.userStatus = false; 
      } else {
        req.userStatus = true;
      }
      ref.update({ active: req.userStatus }, (error) => {
        if (error) {
          return res.sendStatus(500);
        }
        return res.json(req.userStatus);
      })
    })
  }


const seeProgress = (req, res) => {
    const {userId, commName}
  }

app.use(checkRole);
router.get('/:modId', getModule);
router.post('/', createModule);
router.put('/:modId',activateDeactivateUser , getModule);
router.delete('/:modId', deleteModule);



module.exports = router;