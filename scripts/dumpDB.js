#!/usr/bin/env node

require('dotenv').config({ path: `${__dirname}/../.env.local` })
const admin = require('../lib/data/firebaseAdmin')
const db = admin.firestore()
const fs = require('fs')

async function process() {
  const postsRef = await db.collection('posts').get()
  const profilesRef = await db.collection('profiles').get()
  const imagesRef = await db.collection('images').get()

  const posts = postsRef.docs.map(d => ({ ...d.data(), _id: d.id }))
  const profiles = profilesRef.docs.map(d => ({ ...d.data(), _id: d.id }))
  const images = imagesRef.docs.map(d => ({ ...d.data(), _id: d.id }))

  fs.writeFileSync('./dump/post.json', JSON.stringify(posts, null, 2))
  fs.writeFileSync('./dump/profiles.json', JSON.stringify(profiles, null, 2))
  fs.writeFileSync('./dump/images.json', JSON.stringify(images, null, 2))

  console.log('FILES WRITTEN')
}

process()
