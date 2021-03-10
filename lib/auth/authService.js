import { supabase } from '@/lib/db-client/supabase'

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

export async function fetchProfile(key) {
  const id = key.replace('profile/', '')
  const { data, error } = await supabase
    .from('users')
    .select(
      `
      id,
      email,
      is_narrator,
      avatartype,
      displayName:display_name,
      challengeable,
      bio,
      role
      `
    )
    .match({ id })
    .single()

  if (error && error.name !== 'AbortError') {
    console.error(error)
    throw error
  }

  return data
}

export async function updateProfile({ id, bio, avatartype, displayName, challengeable }) {
  const { data, error } = await supabase
    .from('users')
    .update({
      avatartype,
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
  const { data, error } = await supabase.rpc('edit_role', {
    uuid: id,
    new_role: role
  })

  if (error) {
    throw error
  }
  return data
}
