#!/usr/bin/env node

require('dotenv').config({ path: `${__dirname}/../.env.local` })
const supabase = require('../lib/data/supabaseAdmin')

async function main() {
  const { data } = await supabase
    .from('games')
    .select('*, posts(id,slug,name,image)')
    .order('date.asc,time.asc,id', { foreignTable: 'posts' })

  for (const game of data) {
    const post = game.posts.find(p => p.image)
    if (post) {
      await supabase.from('games').update({ image: post.image }).match({ id: game.id })
      console.log(`updated game "${game.name}" with image ${post.image}`)
    }
  }
}

main()
