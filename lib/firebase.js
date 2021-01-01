import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

if (typeof window !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyA9EypsIdvoeuYtw5op7wJrxYhA5LUoRPw',
    authDomain: `guardianes-2018.firebaseapp.com`,
    databaseURL: `https://guardianes-2018.firebaseio.com`,
    storageBucket: `gs://guardianes-2018.appspot.com`,
    projectId: 'guardianes-2018'
  });
}

export { firebase }
