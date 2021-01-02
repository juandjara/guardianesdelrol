const admin = require('firebase-admin')

// taken from here: https://github.com/Lucas-Geitner/next-js-swr-firestore-exemple/blob/master/lib/firebase.js
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email: process.env.FIREBASE_CLIENT_EMAIL
    }),
    databaseURL: 'https://swr-firestore-next-js-exemple.firebaseio.com'
  })
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    // eslint-disable-next-line no-console
    console.error('Firebase admin initialization error', error.stack)
  }
}

module.exports = admin
