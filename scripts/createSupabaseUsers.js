#!/usr/bin/env node

require('dotenv').config({ path: `${__dirname}/../.env.local` })
const profiles = require('../dump/profiles.json')
const supabase = require('../lib/supabaseAdmin')

async function main() {
  // for (const profile of profiles) {
  //   await supabase.auth.api.signUpWithEmail(profile.email, '__Guard14nES__')
  // }
  for (const profile of profiles) {
    await supabase
      .from('users')
      .update({
        display_name: profile.displayName,
        photo_url: profile.photoURL
      })
      .match({ email: profile.email })
    console.log(`updated ${profile.email}`)
  }
  console.log('PROFILES UPDATED')
}

main()
