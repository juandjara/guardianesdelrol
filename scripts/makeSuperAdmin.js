#!/usr/bin/env node

// This file is meant to be executed via CLI, only once, to generate a superadmin
// usage: `FB_UID=<ENTER_UID_HERE> ./scripts/makeSuperAdmin.js`

require('dotenv').config({ path: `${__dirname}/../.env.local` })
const admin = require('../lib/db-client/firebaseAdmin')

admin
  .auth()
  .setCustomUserClaims(process.env.FB_UID, { superadmin: true })
  .then(() => {
    console.log('> superadmin ready')
  })
  .catch(err => {
    console.error('> superadmin error', err)
  })
