import { supabase } from '@/lib/db-client/supabase'

export function gameToForm(game) {
  return {
    name: game?.name || '',
    description: game?.description || '',
    tags: (game?.tags || []).map(t => ({ label: t, value: t }))
  }
}

export function formToGame(id, form) {
  const body = {
    name: form.name,
    description: form.description,
    image: form.image,
    image_position: form.image_position,
    tags: (form?.tags || []).map(t => t.label)
  }
  if (id) body.id = id

  return body
}

export async function upsertGame(id, form) {
  const body = formToGame(id, form)
  const { data, error } = await supabase
    .from('games')
    .insert(body, { upsert: true })
    .match({ id: id || '' })

  if (error) {
    throw error
  }

  return data[0]
}

export async function deleteGame(id) {
  const confirmation = window.confirm('¿Estas seguro de que quieres borrar este juego?')
  if (!confirmation) {
    return
  }

  const { error } = await supabase.from('games').delete().match({ id })
  if (error) {
    throw error
  }
}
