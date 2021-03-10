#!/usr/bin/env node

require('dotenv').config({ path: `${__dirname}/../.env.local` })
const admin = require('../lib/db-client/firebaseAdmin')
const db = admin.firestore()

async function process() {
  const usersRef = await db.collection('users').get()
  const authRef = await admin.auth().listUsers(100)

  // console.log('user emails', usersRef.docs.map(u => u.id).sort())
  // console.log('auth emails', authRef.users.map(u => u.email).sort())

  for (const user of authRef.users) {
    const dbuser = usersRef.docs.find(u => u.id === user.email)
    const { avatarRef = null, displayName = null, photoURL = null, email = null } = dbuser.data()
    const res = await db
      .collection('profiles')
      .doc(user.uid)
      .set({
        acceptingChallenges: false,
        avatarRef,
        displayName,
        photoURL,
        email: email || dbuser.id || null
      })
    console.log(res)
    // if (dbuser) {
    //   await admin.auth().updateUser(user.uid, {
    //     displayName: dbuser.data().displayName,
    //     photoURL: dbuser.data().photoURL
    //   })
    // }
  }
}

process()
