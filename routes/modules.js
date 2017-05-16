import express from 'express';
import firebase from '../helpers/firebase';

const db = firebase.database();
const firebaseAuth = firebase.auth();
const communitiesRef = db.ref('communities');
const modulesRef = db.ref('modules');

const router = express.Router();

router.get('/:comm', (req, res) => {
  const community = req.params.comm;
  const user = firebaseAuth.currentUser;
  if (user) {
    const userInfo = req.user;
    const requestedCommunity = userInfo.communities[community];
    if (requestedCommunity !== undefined) {
      const userLevel = requestedCommunity.completedModules;  // This needs to be converted to  string
      modulesRef.child(community).once('value', (modulesForCommunityData) => {
        const modulesForCommunity = modulesForCommunityData.val();
        const requestedModule = modulesForCommunity[userLevel];
        const error = null;
        res.render(requestedModule, modulesForCommunity, error);
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
        userInfo.communities[community] = newCommunity;
      });
    }
  }
});


// Requesting a module
router.get('/:comm/:id', (req, res) => {
  const community = req.params.comm,
    moduleNumber = req.param.id;

  const user = firebaseAuth.currentUser;
  if (user) {
    // User is signed in.
    const userInfo = req.user;
    const requestedCommunity = userInfo.communities[community]; // The community the student is requesting data for
    if (requestedCommunity !== undefined) { // Check to see if student belongs to the community
      const studentModuleLevel = requestedCommunity.completedModules; // Get student's progress in the community
      // Check if student has completed previous levels
      if (studentModuleLevel >= moduleNumber) {
        modulesRef.child(community).once('value', (modulesForCommunityData) => {
          const modulesForCommunity = modulesForCommunityData.val();
          const requestedModule = modulesForCommunity[moduleNumber];
          modulesForCommunity.answers = null;
          const error = null;
          res.render(requestedModule, modulesForCommunity, error);
        });
      } else {
        modulesRef.child(community).once('value', (modulesForCommunityData) => {
          const modulesForCommunity = modulesForCommunityData.val();
          const highestModuleLevel = modulesForCommunity[studentModuleLevel];
          const error = 'You do not have access to this module yet';
          res.render(highestModuleLevel, modulesForCommunity, error);
        });
      }
    }
  }
});

router.post('/:comm/:id', (req, res) => {
  const community = req.params.comm,
    moduleId = req.params.id,
    user = firebaseAuth.currentUser;
  if (user) {
    communitiesRef.child(`/${community}/modules/`).once('value', (data) => {
      const allModules = data.val(),
        requestedModule = allModules[moduleId],
        questions = requestedModule.questions;
      for (const questionNumber in questions) {
        if (questions.hasOwnProperty(questionNumber)) {
          if (req.body[questionNumber] !== requestedModule.answers[questionNumber]) {
            const error = { error: 'You did not get all questions correctly' };
            return res.render('module', allModules.description, requestedModule, error);
          }
        }
      }
    });
  }
});
