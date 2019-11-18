/**
 * A FireBase Wrapper
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 */

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

class FireBase {
  constructor(apiKey, projectId, messagingSenderId) {
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.messagingSenderId = messagingSenderId;
    this.initializeApp();
  }

  initializeApp() {
    firebase.initializeApp(this.getFireBaseConfig());
  }

  getFireBaseConfig() {
    return {
      apiKey: `${this.apiKey}`,
      authDomain: `${this.projectId}.firebaseapp.com`,
      databaseURL: `https://${this.projectId}.firebaseio.com`,
      projectId: `${this.projectId}`,
      storageBucket: `${this.projectId}.appspot.com`,
      messagingSenderId: `${this.messagingSenderId}`,
    };
  }

  getFirestore() {
    return firebase.firestore();
  }

  getAuth() {
    return firebase.auth();
  }

  getStorage() {
    return firebase.storage();
  }
}

export default FireBase;
