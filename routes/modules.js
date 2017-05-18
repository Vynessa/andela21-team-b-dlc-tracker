import express from 'express';
import firebase from '../helpers/firebase';

const db = firebase.database();
const firebaseAuth = firebase.auth();
const modulesRef = db.ref('modules');
const usersRef = db.ref('users');

const router = express.Router();

router.get('/modules/:comm', (req, res) => {
  const community = req.params.comm;
  const user = firebaseAuth.currentUser;
  if (user) {
    const userId = user.uid;
    const userInfo = req.user;
    if (userInfo.communities === undefined) {
      userInfo.communities = {};
    }
    const requestedCommunity = userInfo.communities[community];
    if (requestedCommunity !== undefined) {
      const userLevel = requestedCommunity.completedModules;
      modulesRef.child(community).once('value', (modulesForCommunityData) => {
        const modulesForCommunity = modulesForCommunityData.val();
        const requestedModule = modulesForCommunity[userLevel];
        const error = null;
        res.render('dashboard', requestedModule, modulesForCommunity, error);
      });
    } else {
      // Add him to the community
      modulesRef.child(community).once('value', (modulesForCommunityData) => {
        const modulesForCommunity = modulesForCommunityData.val();
        const newCommunity = {
          completedModules: 0,
          totalModules: Object.keys(modulesForCommunity).length,
          active: true,
          completed: false
        };
        usersRef.child(`/${userId}/communities/${community}`).set(newCommunity)
          .then(res.redirect(`/modules/${community}/1`))
          .catch((err) => {
          });
      });
    }
  } else {
    res.redirect('/login');
  }
});

// Requesting a module
router.get('/modules/:comm/:id', (req, res) => {
  const community = req.params.comm,
    moduleNumber = req.param.id;

  const user = firebaseAuth.currentUser;
  if (user) {
    // User is signed in.
    const userInfo = req.user;
    // The community the student is requesting data for
    const requestedCommunity = userInfo.communities[community];
    if (requestedCommunity !== undefined) { // Check to see if student belongs to the community
      const studentModuleLevel = requestedCommunity.completedModules; // Get student's progress in the community
      // Check if student has completed previous levels
      if (studentModuleLevel >= moduleNumber) {
        modulesRef.child(community).once('value', (modulesForCommunityData) => {
          const modulesForCommunity = modulesForCommunityData.val();
          const requestedModule = modulesForCommunity[moduleNumber];
          modulesForCommunity.answers = null;
          const error = null;
          res.render('dashboard', requestedModule, modulesForCommunity, error);
        });
      } else {
        modulesRef.child(community).once('value', (modulesForCommunityData) => {
          const modulesForCommunity = modulesForCommunityData.val();
          const highestModuleLevel = modulesForCommunity[studentModuleLevel];
          const error = 'You do not have access to this module yet';
          res.render('dashboard', highestModuleLevel, modulesForCommunity, error);
        });
      }
    }
  } else {
    res.redirect('/login');
  }
});

// Taking the assessment for a module
router.post('/module/:comm/:id', (req, res) => {
  const community = req.params.comm,
    moduleId = req.params.id,
    user = firebaseAuth.currentUser;
  if (user) {
    modulesRef.child(`/${community}`).once('value', (modulesForCommunityData) => {
      const modulesForCommunity = modulesForCommunityData.val(),
        requestedModule = modulesForCommunity[moduleId],
        questions = requestedModule.questions;
      for (const questionNumber in questions) {
        if (questions.hasOwnProperty(questionNumber)) {
          if (req.body[questionNumber] !== requestedModule.answers[questionNumber]) {
            const error = { error: 'You did not get all questions correctly' };
            // Make answers invisible before sending
            modulesForCommunity.answers = null;
            return res.render('module', modulesForCommunity, requestedModule, error);
          } else {
            // Load the next module, after sending a sweet alert
            const nextModuleId = moduleId + 1;
            const nextModule = modulesForCommunity[nextModuleId];
            modulesForCommunity.answers = null;
            res.render('module', modulesForCommunity, nextModule);
          }
        }
      }
    });
  }
});

export default router;
