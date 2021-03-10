import { useAlert } from '@/components/AlertContext'
import Autocomplete from '@/components/Autocomplete'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import ImageInput from '@/components/ImageInput'
import Label from '@/components/Label'
import Select from 'react-select'
import Title from '@/components/Title'
import { supabase } from '@/lib/db-client/supabase'
import { fetchGames } from '@/lib/data/useGames'
import usePostDetail from '@/lib/data/usePostDetail'
import useSections from '@/lib/data/useSections'
import { defaultImageState, imageReducer } from '@/lib/imageReducer'
import uploadImage from '@/lib/uploadImage'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { mutate } from 'swr'
import AvatarList from '@/components/AvatarList'
import TagsInput from '@/components/TagsInput'
import { fetchUsers } from '@/lib/data/useUsers'

const inputStyles =
  'w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700'
const TextEditor = dynamic(() => import('@/components/TextEditor'), { ssr: false })

function defaultFormState(post) {
  return {
    name: post?.name || '',
    description: post?.description || '',
    date: post?.date || '',
    time: post?.time || '',
    place: post?.place || '',
    seats: post?.seats || 0,
    game: post?.game,
    section: post?.section && { label: post?.section?.name, value: post?.section?.id },
    tags: (post?.tags || []).map(t => ({ label: t, value: t }))
  }
}

async function fetchUsersForSelect(query) {
  const { rows } = await fetchUsers(query)
  return {
    rows: rows.map(r => ({
      ...r,
      name: r.displayName
    }))
  }
}

function AddUserInput() {
  const [newUser, setNewUser] = useState(null)

  return (
    <div className="mt-2 max-w-sm flex items-center">
      <Autocomplete
        id="new_player"
        placeholder="Buscar usuarios..."
        className="w-64"
        value={newUser}
        onChange={setNewUser}
        fetcher={fetchUsersForSelect}
      />
      <Button
        small
        type="button"
        hasIcon="left"
        background="bg-gray-100"
        color="text-gray-700"
        title="Añadir nuevo jugador"
        border="border-gray-200 border-2 hover:border-gray-300"
        className="ml-2 pl-2">
        <svg
          width={24}
          height={24}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span>Añadir</span>
      </Button>
    </div>
  )
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

  const { sections } = useSections()
  const sectionOptions = sections.map(s => ({ value: s.id, label: s.name }))

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
        date: form?.date,
        time: form?.time,
        narrator_id: post?.narrator_id || session.user.id,
        seats: form?.seats,
        place: form?.place,
        game: form?.game?.id,
        section: form?.section?.value,
        tags: (form?.tags || []).map(t => t.label),
        // TODO
        // type: post?.type,
        place_link: post?.place_link
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
    <main className="flex-auto py-3 mx-auto max-w-3xl w-full">
      <Title title={title} />
      <header className="flex items-center pl-2 space-x-4">
        <BackButton colors="bg-opacity-20 text-white bg-gray-50 hover:bg-opacity-50" />
        <h1 className="text-xl font-semibold">{title}</h1>
      </header>
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-700 space-y-8 mt-2 p-4 pt-6 md:rounded-lg relative">
        <div>
          <Label text="Imagen" />
          <ImageInput state={imageState} dispatch={dispatch} />
        </div>
        <div className="max-w-lg">
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
        <div className="max-w-lg">
          <Label name="game" text="Juego" />
          <Autocomplete
            id="game"
            placeholder="Seleccione un juego..."
            value={form.game}
            onChange={value => update('game', value)}
            fetcher={fetchGames}
          />
        </div>
        <div className="max-w-lg">
          <Label text="Evento" />
          <Select
            isClearable
            className="react-select"
            options={sectionOptions}
            onChange={ev => update('section', ev)}
            value={form.section}
            noOptionsMessage={() => 'Ningún juego para esta búsqueda'}
            placeholder="Selecciona un evento"
          />
        </div>
        <div className="max-w-lg">
          <Label text="Etiquetas" />
          <TagsInput
            value={form.tags}
            onChange={ev => update('tags', ev)}
            placeholder="Escribe una etiqueta y pulsa Enter o Tab"
          />
        </div>
        <div className="max-w-lg">
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
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
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
          <div className="col-span-2 md:col-span-1">
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
        <div>
          <div className="mb-4 flex space-x-2 items-baseline">
            <Label margin="" text="Jugadores" />
            <span className="flex-shrink-0">{post?.players.length} /</span>
            <div className="w-20">
              <input
                id="seats"
                type="text"
                className={inputStyles}
                placeholder=""
                value={form.seats}
                onChange={ev => update('seats', ev.target.value)}
                required
              />
            </div>
          </div>
          <AvatarList users={post?.players} />
          <AddUserInput />
        </div>
        <div className="pt-4 h-full editor-wrapper">
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
