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
