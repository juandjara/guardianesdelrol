import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Label from '@/components/Label'
import Title from '@/components/Title'
import ImageInput from '@/components/ImageInput'
import { supabase } from '@/lib/db-client/supabase'
import useGameDetail from '@/lib/games/useGameDetail'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { useAlert } from '@/components/AlertContext'
import { mutate } from 'swr'
import dynamic from 'next/dynamic'
import { defaultImageState, imageReducer } from '@/lib/images/imageReducer'
import uploadImage from '@/lib/images/uploadImage'

const TextEditor = dynamic(() => import('@/components/TextEditor'), { ssr: false })

function defaultFormState(game) {
  return {
    name: game?.name || '',
    description: game?.description || ''
  }
}

export default function CatalogEdit() {
  const router = useRouter()
  const id = router.query.id === 'new' ? null : router.query.id
  const { data: game } = useGameDetail(id)

  const { setAlert } = useAlert()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(() => defaultFormState(game))
  const [imageState, dispatch] = useReducer(imageReducer, defaultImageState(game))

  useEffect(() => {
    setForm(defaultFormState(game))
    dispatch({ type: 'RESET', payload: defaultImageState(game) })
  }, [game])

  function update(key, value) {
    setForm(form => ({ ...form, [key]: value }))
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setLoading(true)

    try {
      let image = imageState.filename
      if (imageState.dirty) {
        image = await uploadImage(imageState)
      }

      const body = {
        name: form.name,
        description: form.description,
        image_position: imageState.position,
        image
      }
      if (id) body.id = id

      const { data, error } = await supabase
        .from('games')
        .insert(body, { upsert: true })
        .match({ id: id || '' })

      if (error) {
        throw error
      }

      const result = data[0]
      if (game) {
        mutate(`game-detail/${result.id}`, { ...game, ...result }, false)
      }
      router.push(`/catalog/${result.id}/${result.slug}`)
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }

    setLoading(false)
  }

  async function handleDelete() {
    const confirmation = window.confirm('¿Estas seguro de que quieres borrar este juego?')
    if (!confirmation) {
      return
    }

    const { error } = await supabase.from('games').delete().match({ id })
    if (error) {
      console.error(error)
      setAlert(error.message)
    } else {
      router.replace('/catalog')
    }
  }

  const title = id ? `Editar juego` : 'Nuevo juego'
  const updateEditor = useCallback(value => update('description', value), [])

  return (
    <main className="flex-auto py-3 mx-auto max-w-4xl w-full">
      <Title title={title} />
      <header className="flex items-center pl-2 space-x-4">
        <BackButton colors="bg-opacity-20 text-white bg-gray-50 hover:bg-opacity-50" />
        <h1 className="text-xl font-semibold">{title}</h1>
      </header>
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-700 space-y-6 mt-2 p-4 pt-6 md:rounded-lg relative">
        <div>
          <Label text="Imagen" />
          <ImageInput state={imageState} dispatch={dispatch} />
        </div>
        <div>
          <Label name="name" text="Nombre" />
          <input
            id="name"
            type="text"
            className="w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
            placeholder="Nombre"
            value={form.name}
            onChange={ev => update('name', ev.target.value)}
            required
          />
        </div>
        <div className="h-full editor-wrapper">
          <Label name="" text="Descripción" />
          <TextEditor
            imageEditorPath="/editor/games"
            value={game?.description}
            onChange={updateEditor}
          />
        </div>
        <section className="flex justify-end items-center space-x-2">
          {id && (
            <Button
              onClick={handleDelete}
              disabled={loading}
              type="button"
              border="border-none"
              background="hover:bg-gray-100"
              color="text-gray-600">
              Eliminar
            </Button>
          )}
          <div className="flex-grow"></div>
          <Button
            onClick={() => router.back()}
            disabled={loading}
            type="button"
            border="border-none"
            color="text-red-900">
            Cancelar
          </Button>
          <Button
            disabled={loading}
            type="submit"
            border="border-none"
            color="text-white"
            background="bg-red-500 hover:bg-red-600">
            Guardar
          </Button>
        </section>
      </form>
    </main>
  )
}
