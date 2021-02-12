#!/usr/bin/env node

require('dotenv').config({ path: `${__dirname}/../.env.local` })
const images = require('../dump/images.json')
const supabase = require('../lib/data/supabaseAdmin')

async function main() {
  await supabase.from('images').insert(
    images.map(i => ({
      name: i.name,
      type: i.type,
      size: i.size,
      download_url: i.downloadUrl,
      upload_date: i.uploadDate
    }))
  )

  console.log('IMAGES INSERTED')
}

main()
