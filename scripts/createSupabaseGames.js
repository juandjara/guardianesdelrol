#!/usr/bin/env node

require('dotenv').config({ path: `${__dirname}/../.env.local` })
const posts = require('../dump/post.json')
const supabase = require('../lib/db-client/supabaseAdmin')

const sectionsMap = [
  { label: 'Guardianes del Rol', value: 'guardianes_rol' },
  { label: 'Aniversario Lovecraft', value: 'aniv_lovecraft' },
  { label: 'El Dado Guardián', value: 'dado_guardian' },
  { label: 'Dia Plateado III', value: 'dia_plateado_3' },
  { label: 'El Pícaro del Rol: Sobrevive al 20-20', value: 'elpicarodelrol' }
]

async function main() {
  // const games = Array.from(new Set(posts.map(p => p.game)))
  // await supabase.from('games').insert(games.map(g => ({ name: g })))
  const { data: games } = await supabase.from('games').select('*')
  const { data: sections } = await supabase.from('sections').select('*')
  const { data: users } = await supabase.from('users').select('*')

  const postsData = []
  for (const post of posts) {
    const postSection = sectionsMap.find(s => s.value === post.section) || sectionsMap[0]
    const section = sections.find(s => s.name === postSection.label)
    const game = games.find(g => g.name === post.game)
    const imageType = post.mainImageUrl && post.mainImageUrl.substr(-3)
    const imageLink =
      post.mainImageUrl &&
      post.mainImageUrl
        .replace('https://firebasestorage.googleapis.com/v0/b/guardianes-2018.appspot.com/o/', '')
        .split('?')[0]
        .replace(post.mainImageUrl.split('_')[0] + '_', '')
        .replace(new RegExp(`-${imageType}$`), '.' + imageType)

    const guests = []
    for (const player of post.players) {
      const user = users.find(u => u.email === player.email)
      if (!user) {
        guests.push(player.displayName)
      }
    }

    const narratorEmail = post.narrator.email
    const narrator = users.find(u => u.email == narratorEmail)

    postsData.push({
      name: post.title || null,
      description: post.description || null,
      place: post.place || null,
      image: imageLink || null,
      date: post.date || null,
      time: post.hour || null,
      seats: post.totalSeats,
      tags: [],
      game: game.id,
      section: section.id,
      narrator: narrator?.id || null,
      guest_players: guests
    })
  }

  const { data, error } = await supabase.from('posts').insert(postsData)
  if (error) {
    console.log(error)
  } else {
    console.log('POSTS INSERTED')
    console.log(data)
  }
}

main()

async function createPlayers() {
  const { data: users } = await supabase.from('users').select('*')
  const { data: newPosts } = await supabase.from('posts').select('*')

  const insert = []
  for (const post of posts) {
    const newPost = newPosts.find(p => p.slug === post.slug && p.date === post.date)
    if (newPosts) {
      for (const player of post.players) {
        const user = users.find(u => u.email === player.email)
        if (user) {
          insert.push({
            user_id: user.id,
            post_id: newPost.id
          })
        }
      }
    }
  }

  const { data, error } = await supabase.from('players').insert(insert)
  if (error) {
    console.log(error)
  } else {
    console.log('PLAYERS INSERTED')
    console.log(data)
  }
}

createPlayers()
