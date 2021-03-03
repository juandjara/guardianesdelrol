import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Label from '@/components/Label'
import Title from '@/components/Title'
import ImageInput from '@/components/ImageInput'
import { supabase } from '@/lib/data/supabase'
import useGameDetail from '@/lib/data/useGameDetail'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useReducer, useState } from 'react'
import axios from 'axios'
import { useAlert } from '@/components/AlertContext'
import { mutate } from 'swr'
import dynamic from 'next/dynamic'

const TextEditor = dynamic(() => import('@/components/TextEditor'), { ssr: false })

function imageReducer(state, { type, payload }) {
  switch (type) {
    case 'SET_IMAGE':
      return {
        url: payload.url,
        filename: payload.filename,
        dirty: true,
        position: 50
      }
    case 'UPDATE_IMAGE_POSITION':
      return { ...state, position: payload }
    case 'REMOVE_IMAGE':
      return {
        url: null,
        filename: null,
        position: 50,
        dirty: false
      }
    case 'RESET':
      return {
        url: payload.url,
        filename: payload.filename,
        position: payload.position,
        dirty: false
      }
    default:
      return state
  }
}

function defaultFormState(game) {
  return {
    name: game?.name || '',
    description: game?.description || ''
  }
}

function defaultImageState(game) {
  return {
    url: game?.image && `${process.env.NEXT_PUBLIC_IMAGEKIT_URL}/${game?.image}`,
    filename: game?.image,
    position: game?.image_position ?? 50,
    dirty: false
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

  async function uploadImage() {
    const { url, filename } = imageState
    if (!url) {
      return null
    }

    const session = supabase.auth.session()
    const formData = new FormData()
    formData.set('file', url)
    formData.set('filename', filename)
    formData.set('token', session.access_token)
    await axios.post('/api/upload', formData)
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setLoading(true)

    try {
      if (imageState.dirty) {
        await uploadImage()
      }

      const body = {
        id,
        name: form.name,
        description: form.description,
        image: imageState.filename,
        image_position: imageState.position
      }

      const { data, error } = await supabase
        .from('games')
        .insert(body, { upsert: true })
        .match({ id: id || '' })

      if (error) {
        throw error
      }

      const result = data[0]
      mutate(`game-detail/${result.id}`, game ? { ...game, ...result } : result, false)
      router.push(`/catalog/${result.id}/${result.slug}`)
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }

    setLoading(false)
  }

  const title = id ? `Editar ${game?.name}` : 'Nuevo juego'
  const updateEditor = useCallback(value => update('description', value), [])

  return (
    <main className="flex-auto p-3 mx-auto max-w-4xl w-full">
      <Title title={title} />
      <header className="flex items-center space-x-4">
        <BackButton colors="bg-opacity-20 text-white bg-gray-50 hover:bg-opacity-50" />
        <h1 className="text-xl font-semibold">{title}</h1>
      </header>
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-700 space-y-6 mt-2 p-4 pt-6 rounded-lg relative">
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
          <TextEditor value={game?.description} onChange={updateEditor} />
        </div>
        <div className="flex justify-end items-center space-x-2">
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
        </div>
      </form>
    </main>
  )
}
