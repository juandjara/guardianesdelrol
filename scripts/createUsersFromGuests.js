#!/usr/bin/env node

require('dotenv').config({ path: `${__dirname}/../.env.local` })
const supabase = require('../lib/db-client/supabaseAdmin')
// const { v4: uuid } = require('uuid')

async function main() {
  const { data: users } = await supabase.from('users').select('*').match({ email: 'guest' })
  const { data: gplays } = await supabase.from('guest_players').select('*')

  const insert = []
  for (const user of users) {
    for (const play of gplays) {
      if (play.name === user.display_name) {
        insert.push({ user_id: user.id, post_id: play.post_id })
      }
    }
  }

  const { data, error } = await supabase.from('players').insert(insert)

  if (error) {
    console.error(error)
  } else {
    console.log(data)
  }
}

main()
