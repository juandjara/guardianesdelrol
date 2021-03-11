import { mutate } from 'swr'
import { supabase } from '../db-client/supabase'

export async function addPlayer({ userId, postId }) {
  return await mutate(`post-detail/${postId}`, async () => {
    const { error } = await supabase
      .from('players')
      .insert([{ post_id: postId, user_id: userId }])
      .single()

    if (error) {
      throw error
    }
  })
}

export async function removePlayer({ userId, postId }) {
  return await mutate(`post-detail/${postId}`, async () => {
    const { error } = await supabase
      .from('players')
      .delete()
      .match({ post_id: postId, user_id: userId })

    if (error) {
      throw error
    }
  })
}

export function postToForm(post) {
  return {
    name: post?.name || '',
    description: post?.description || '',
    date: post?.date || '',
    time: post?.time || '',
    place: post?.place || '',
    seats: post?.seats || 0,
    game: post?.game,
    section: post?.section && { label: post?.section?.name, value: post?.section?.id },
    tags: (post?.tags || []).map(t => ({ label: t, value: t })),
    place_link: post?.place_link || '',
    narrator_id: post?.narrator_id,
    players: post?.players || []
  }
}

export function formToPost(id, form) {
  const session = supabase.auth.session()
  const body = {
    image: form.image,
    image_position: form.image_position,
    name: form.name,
    description: form.description,
    date: form?.date,
    time: form?.time,
    narrator_id: form?.narrator_id || session.user.id,
    seats: form?.seats,
    place: form?.place,
    game: form?.game?.id,
    section: form?.section?.value,
    tags: (form?.tags || []).map(t => t.label),
    place_link: form?.place_link
  }
  if (id) body.id = id

  return body
}

export async function upsertPost(id, form) {
  const body = formToPost(id, form)
  const { data, error } = await supabase
    .from('posts')
    .insert(body, { upsert: true })
    .match({ id: id || '' })

  if (error) {
    throw error
  }

  const post = data[0]
  const { error: rpcerror } = await supabase.rpc('update_players', {
    postid: post.id,
    players: form.players.map(u => u.id)
  })

  if (rpcerror) {
    throw rpcerror
  }

  return post
}

export async function deletePost(id) {
  const confirmation = window.confirm('¿Estas seguro de que quieres borrar esta partida?')
  if (!confirmation) {
    return
  }

  const { error: error1 } = await supabase.from('players').delete().match({ post_id: id })
  if (error1) {
    throw error1
  }

  const { error: error2 } = await supabase.from('posts').delete().match({ id })
  if (error2) {
    throw error2
  }
}
