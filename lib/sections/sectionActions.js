import { supabase } from '@/lib/db-client/supabase'

export function sectionToForm(section) {
  return {
    name: section?.name || '',
    description: section?.description || ''
  }
}

export function formToSection(id, form) {
  const body = {
    name: form.name,
    description: form.description,
    image: form.image,
    image_position: form.image_position
  }
  if (id) body.id = id

  return body
}

export async function upsertSection(id, form) {
  const body = formToSection(id, form)
  const { data, error } = await supabase
    .from('sections')
    .insert(body, { upsert: true })
    .match({ id: id || '' })

  if (error) {
    throw error
  }

  return data[0]
}

export async function deleteSection(id) {
  const confirmation = window.confirm('¿Estas seguro de que quieres borrar este evento?')
  if (!confirmation) {
    return false
  }

  const { error } = await supabase.from('sections').delete().match({ id })
  if (error) {
    throw error
  }

  return true
}
