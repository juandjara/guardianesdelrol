#!/usr/bin/env node

require('dotenv').config({ path: `${__dirname}/../.env.local` })
const admin = require('../lib/firebaseAdmin')

async function process() {
  const ref = await admin.auth().listUsers(500)
  const ids = ref.users.filter(u => u.providerData.length === 0).map(u => u.uid)

  const res = await admin.auth().deleteUsers(ids)
  console.log(res)
}

process()
