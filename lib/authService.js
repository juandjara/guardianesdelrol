import { supabase } from '@/lib/supabase'

export function getSavedSession() {
  const saved = JSON.parse(localStorage.getItem('supabase.auth.token'))
  return saved?.currentSession
}

export function isTokenExpired(token) {
  if (!token) {
    return true
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const time = payload.exp * 1000
    return time < Date.now()
  } catch (err) {
    console.error(err)
    return true
  }
}

export async function fetchProfile(id) {
  id = id.replace('profile/', '')
  const { data, error } = await supabase
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

  if (error) {
    throw error
  }
  return data
}

export async function updateProfile({ id, bio, photoURL, displayName, challengeable }) {
  const { data, error } = await supabase
    .from('users')
    .update({
      photoURL,
      display_name: displayName,
      challengeable,
      bio
    })
    .match({ id })
    .single()

  if (error) {
    throw error
  }
  return data
}

export async function updatePermissions({ id, role }) {
  const { error, data } = await supabase
    .from('permissions')
    .insert([{ id, role }], { upsert: true })
    .match({ id })
    .single()

  if (error) {
    throw error
  }
  return data
}
