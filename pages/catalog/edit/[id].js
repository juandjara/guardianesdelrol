import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Label from '@/components/Label'
import TextEditor from '@/components/TextEditor'
import Title from '@/components/Title'
import ImageInput from '@/components/ImageInput'
import { supabase } from '@/lib/data/supabase'
import useGameDetail from '@/lib/data/useGameDetail'
import { useRouter } from 'next/router'
import { useEffect, useReducer, useState } from 'react'
import axios from 'axios'
import { useAlert } from '@/components/AlertContext'
import { mutate } from 'swr'

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
    default:
      return state
  }
}

function formReducer(state, { type, payload }) {
  const image = imageReducer(state.image, { type, payload })
  switch (type) {
    case 'UPDATE':
      return { ...state, ...payload, image }
    default:
      return { ...state, image }
  }
}

function defaultFormState(game) {
  return {
    name: game?.name || '',
    description: game?.description || '',
    image: {
      url: game?.image && `${process.env.NEXT_PUBLIC_IMAGEKIT_URL}/${game?.image}`,
      filename: game?.image,
      position: game?.image_position ?? 50,
      dirty: false
    }
  }
}

export default function CatalogEdit() {
  const router = useRouter()
  const id = router.query.id
  const { data: game } = useGameDetail(id)

  const { setAlert } = useAlert()
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(formReducer, defaultFormState(game))

  useEffect(() => {
    dispatch({ type: 'UPDATE', payload: defaultFormState(game) })
  }, [game])

  function update(key, value) {
    dispatch({ type: 'UPDATE', payload: { [key]: value } })
  }

  async function uploadImage() {
    const { url, filename } = state.image
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
      if (state.image.dirty) {
        await uploadImage()
      }

      const body = {
        name: state.name,
        description: state.description,
        image: state.image.filename,
        image_position: state.image.position
      }

      const { error } = await supabase.from('games').update(body).match({ id })

      if (error) {
        throw error
      }

      mutate(`game-detail/${game.id}`, { ...game, ...body }, false)
      router.push(`/catalog/${game.id}/${game.slug}`)
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }

    setLoading(false)
  }

  return (
    <main className="flex-auto p-3 mx-auto max-w-4xl w-full">
      <Title title="Editar juego" />
      <header className="flex items-center space-x-4">
        <BackButton colors="bg-opacity-20 text-white bg-gray-50 hover:bg-opacity-50" />
        <h1 className="text-xl font-semibold">Editar juego</h1>
      </header>
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-700 space-y-6 mt-2 p-4 pt-6 rounded-lg relative">
        <div>
          <Label text="Imagen" />
          <ImageInput state={state.image} dispatch={dispatch} />
        </div>
        <div>
          <Label name="name" text="Nombre" />
          <input
            id="name"
            type="text"
            className="w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
            placeholder="Nombre"
            value={state.name}
            onChange={ev => update('name', ev.target.value)}
            required
          />
        </div>
        <div className="h-full editor-wrapper">
          <Label name="" text="Descripción" />
          {game ? (
            <TextEditor
              value={state.description}
              onChange={value => update('description', value)}
            />
          ) : (
            <div className="h-32 w-full rounded-lg border border-gray-300"></div>
          )}
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
