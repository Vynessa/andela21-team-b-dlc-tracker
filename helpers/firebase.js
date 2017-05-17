import firebase from 'firebase';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  databaseURL: process.env.databaseURL,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId
};

export default firebase.initializeApp(config);
