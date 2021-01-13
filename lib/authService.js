import { supabase } from '@/lib/supabase'

export async function fetchProfile(id) {
  return await supabase
    .from('users_with_permissions')
    .select(
      `
      id,
      email,
      displayName:display_name,
      photoURL:photo_url,
      challengeable,
      bio,
      role
      `
    )
    .match({ id })
    .single()
}

export async function updateProfile({ id, bio, photoURL, displayName, challengeable }) {
  return await supabase
    .from('users')
    .update({
      photoURL,
      display_name: displayName,
      challengeable,
      bio
    })
    .match({ id })
    .single()
}

export async function updatePermissions({ id, role }) {
  return await supabase
    .from('permissions')
    .insert([{ id, role }], { upsert: true })
    .match({ id })
    .single()
}
