import express from 'express';
import firebase from '../helpers/firebase';

const db = firebase.database();
const firebaseAuth = firebase.auth();
const router = express.Router();
const communitiesRef = db.ref('communities');

// dashboard
router.get('/', (req, res) => {
  const user = firebaseAuth.currentUser;
  if (user) {
    const userData = req.user;
    // Communities a user belongs to
    const userCommunities = userData.communities;
    const communityDescriptions = [];
    communitiesRef.once('value', (data) => {
      const communities = data.val();
      for (const community in communities) {
        if (communities.hasOwnProperty(community)) {
          communityDescriptions.push(community.description);
        }
      }
      res.render('dashboard', { userData, userCommunities, communities: communityDescriptions });
    });
  }
});

export default router;
