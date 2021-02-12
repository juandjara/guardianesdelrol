#!/usr/bin/env node

require('dotenv').config({ path: `${__dirname}/../.env.local` })
const supabase = require('../lib/data/supabaseAdmin')

async function main() {
  const { data: posts } = await supabase.from('posts').select('*')
  const players = []
  for (const post of posts) {
    if (post.guest_players && post.guest_players.length) {
      for (const name of post.guest_players) {
        players.push({ post_id: post.id, name })
      }
    }
  }

  const { data, error } = await supabase.from('guest_players').insert(players)
  if (error) {
    console.log(error)
  } else {
    console.log('GUEST PLAYERS INSERTED')
    console.log(data)
  }
}

main()
