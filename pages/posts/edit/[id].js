import { useAlert } from '@/components/AlertContext'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import ImageInput from '@/components/ImageInput'
import Label from '@/components/Label'
import Title from '@/components/Title'
import { supabase } from '@/lib/data/supabase'
import usePostDetail from '@/lib/data/usePostDetail'
import { defaultImageState, imageReducer } from '@/lib/imageReducer'
import uploadImage from '@/lib/uploadImage'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { mutate } from 'swr'

const inputStyles =
  'w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700'
const TextEditor = dynamic(() => import('@/components/TextEditor'), { ssr: false })

function defaultFormState(post) {
  return {
    name: post?.name || '',
    description: post?.description || '',
    date: post?.date || '',
    time: post?.time || '',
    place: post?.place || ''
  }
}

export default function PostEdit() {
  const router = useRouter()
  const id = router.query.id === 'new' ? null : router.query.id
  const { data: post } = usePostDetail(id)
  const title = id ? `Editar partida` : 'Nueva partida'
  const updateEditor = useCallback(value => update('description', value), [])

  const { setAlert } = useAlert()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(() => defaultFormState(post))
  const [imageState, dispatch] = useReducer(imageReducer, defaultImageState(post))

  useEffect(() => {
    setForm(defaultFormState(post))
    dispatch({ type: 'RESET', payload: defaultImageState(post) })
  }, [post])

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

      const session = supabase.auth.session()
      const body = {
        name: form.name,
        description: form.description,
        image_position: imageState.position,
        image,
        date: post?.date,
        time: post?.time,
        narrator_id: session.user.id,
        // TODO
        tags: post?.tags || [],
        seats: post?.seats,
        section: post?.section?.id,
        type: post?.type,
        place: post?.place,
        place_link: post?.place_link,
        game: post?.game?.id
        // guest_narrator: post?.guest_narrator
      }
      if (id) body.id = id

      const { data, error } = await supabase
        .from('posts')
        .insert(body, { upsert: true })
        .match({ id: id || '' })

      if (error) {
        throw error
      }

      const result = data[0]
      if (post) {
        mutate(`post-detail/${result.id}`, { ...post, ...result }, false)
      }
      router.push(`/posts/${result.id}/${result.slug}`)
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }

    setLoading(false)
  }

  async function handleDelete() {
    const confirmation = window.confirm('¿Estas seguro de que quieres borrar esta partida?')
    if (!confirmation) {
      return
    }

    const { error } = await supabase.from('posts').delete().match({ id })
    if (error) {
      console.error(error)
      setAlert(error.message)
    } else {
      router.replace('/posts')
    }
  }

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
            className={inputStyles}
            placeholder="Nombre"
            value={form.name}
            onChange={ev => update('name', ev.target.value)}
            required
          />
        </div>
        <div className="flex flex-wrap">
          <div className="flex-grow mb-4 mr-2">
            <Label name="place" text="Lugar" />
            <input
              id="place"
              type="text"
              className={inputStyles}
              placeholder=""
              value={form.place}
              onChange={ev => update('place', ev.target.value)}
            />
          </div>
          <div className="flex-grow mb-4 mr-2">
            <Label name="date" text="Fecha" />
            <input
              id="date"
              type="date"
              className={inputStyles}
              placeholder="DD/MM/AAAA"
              value={form.date}
              onChange={ev => update('date', ev.target.value)}
              required
            />
          </div>
          <div className="flex-grow mb-4">
            <Label name="time" text="Hora" />
            <input
              id="time"
              type="text"
              className={inputStyles}
              placeholder="HH:mm"
              value={form.time}
              onChange={ev => update('time', ev.target.value)}
            />
          </div>
        </div>
        <div className="h-full editor-wrapper">
          <Label name="" text="Descripción" />
          <TextEditor value={post?.description} onChange={updateEditor} />
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
