#!/usr/bin/env node

require('dotenv').config({ path: `${__dirname}/../.env.local` })
const admin = require('../lib/firebase')
const storage = admin.storage()
const profiles = require('../dump/profiles.json')

async function main() {
  const bucket = storage.bucket(admin.app().options.storageBucket)
  const profilesWithPhoto = profiles.filter(u => u.avatarRef)
  for (const profile of profilesWithPhoto) {
    await bucket.file(profile.avatarRef).copy(bucket.file(`avatar/${profile._id}`))
    console.log(`File "${profile.avatarRef}" moved to "avatar/${profile._id}"`)
  }
}

main()
