import { useAlert } from '@/components/AlertContext'
import Autocomplete from '@/components/Autocomplete'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import ImageInput from '@/components/ImageInput'
import Label from '@/components/Label'
import Select from 'react-select'
import Title from '@/components/Title'
import { fetchGames } from '@/lib/games/useGames'
import usePostDetail from '@/lib/posts/usePostDetail'
import useSections from '@/lib/useSections'
import { defaultImageState, imageReducer } from '@/lib/images/imageReducer'
import uploadImage from '@/lib/images/uploadImage'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { mutate } from 'swr'
import AvatarList from '@/components/AvatarList'
import TagsInput from '@/components/TagsInput'
import { fetchUsers } from '@/lib/users/useUsers'
import { deletePost, postToForm, upsertPost } from '@/lib/posts/postActions'
import { Transition } from '@headlessui/react'
import { upsertGame } from '@/lib/games/gameActions'
import useIsMounted from '@/lib/useIsMounted'

const inputStyles =
  'w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
const TextEditor = dynamic(() => import('@/components/TextEditor'), { ssr: false })

async function fetchUsersForSelect(query) {
  const { rows } = await fetchUsers(query)
  return {
    rows: rows.map(r => ({
      ...r,
      name: r.displayName
    }))
  }
}

function AddUserInput({ onAdd }) {
  const [newUser, setNewUser] = useState(null)

  function handleClick() {
    onAdd(newUser)
    setNewUser(null)
  }

  return (
    <div className="max-w-sm flex items-center">
      <Autocomplete
        id="new_player"
        placeholder="Buscar usuarios..."
        className="w-64"
        value={newUser}
        onChange={setNewUser}
        fetcher={fetchUsersForSelect}
        noDataMessage="Ningún usuario para esta búsqueda"
      />
      <Button
        small
        disabled={!newUser}
        onClick={handleClick}
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

  const isMountedRef = useIsMounted()
  const { setAlert } = useAlert()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(() => postToForm(post))
  const [imageState, dispatch] = useReducer(imageReducer, defaultImageState(post))

  const { sections } = useSections()
  const sectionOptions = sections.map(s => ({ value: s.id, label: s.name }))
  const [placeURLOpen, setPlaceURLOpen] = useState(false)
  const formValid = form.name && form.date && form.game

  useEffect(() => {
    setForm(postToForm(post))
    dispatch({ type: 'RESET', payload: defaultImageState(post) })
  }, [post])

  function update(key, value) {
    setForm(form => ({ ...form, [key]: value }))
  }

  function handleAddPlayer(user) {
    setForm(form => ({
      ...form,
      players: form.players.concat(user)
    }))
  }

  function handleRemovePlayer(user) {
    setForm(form => ({
      ...form,
      players: form.players.filter(u => u.id !== user.id)
    }))
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!formValid) {
      return
    }

    setLoading(true)

    try {
      let image = imageState.filename
      if (imageState.dirty) {
        image = await uploadImage(imageState)
      }

      const newPost = await upsertPost(id, {
        ...form,
        image,
        image_position: imageState.position
      })

      if (post) {
        mutate(`post-detail/${newPost.id}`, { ...post, ...newPost }, false)
      }
      return router.push(`/posts/${newPost.id}/${newPost.slug}`)
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }

    setLoading(false)
  }

  async function handleDelete() {
    setLoading(true)
    try {
      const confirmation = await deletePost(id)
      if (confirmation) {
        return router.replace('/posts')
      }
    } catch (error) {
      console.error(error)
      setAlert(error.message)
    }
    setLoading(false)
  }

  function required(text) {
    return (
      <>
        <span>{text}</span>
        <span title="Obligatorio" className="text-gray-400 ml-0.5">
          *
        </span>
      </>
    )
  }

  async function handleNewUser() {
    const name = window.prompt('Introduzca el nombre del usuario invitado')
    if (!name) return
  }
  async function handleNewSection() {
    const name = window.prompt('Introduzca el nombre del nuevo evento')
    if (!name) return
  }
  async function handleNewGame() {
    const name = window.prompt('Introduzca el nombre del nuevo juego')
    if (!name) return
    const game = await upsertGame(null, { name })
    if (isMountedRef.current) {
      update('game', game)
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
          <Label name="name" text={required('Nombre')} />
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
          <div className="mb-1 flex items-center justify-between">
            <Label margin="" name="game" text={required('Juego')} />
            <button
              type="button"
              onClick={handleNewGame}
              className="hover:underline text-blue-500 text-sm">
              Crear nuevo juego
            </button>
          </div>
          <Autocomplete
            id="game"
            placeholder="Seleccione un juego..."
            value={form.game}
            onChange={value => update('game', value)}
            fetcher={fetchGames}
          />
        </div>
        <div className="max-w-lg">
          <Label name="date" text={required('Fecha')} />
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
        <div className="max-w-lg">
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
        <div className="max-w-lg">
          <div className="mb-1 flex items-center justify-between">
            <Label margin="" name="place" text="Lugar" />
            <button
              type="button"
              onClick={() => setPlaceURLOpen(!placeURLOpen)}
              className="hover:underline text-blue-500 text-sm">
              {placeURLOpen ? 'Ocultar enlace' : 'Mostrar enlace'}
            </button>
          </div>
          <input
            id="place"
            type="text"
            className={inputStyles}
            placeholder="Lugar"
            value={form.place}
            onChange={ev => update('place', ev.target.value)}
          />
          <Transition
            show={placeURLOpen}
            enter="origin-top transition transform duration-200 ease-out"
            enterFrom="scale-y-50 opacity-0"
            enterTo="scale-y-100 opacity-100"
            leave="origin-top transition transform duration-200 ease-out"
            leaveFrom="scale-y-100 opacity-100"
            leaveTo="scale-y-50 opacity-0">
            <input
              id="place_link"
              type="url"
              className={`mt-1 ${inputStyles}`}
              placeholder="Añadir enlace aquí"
              value={form.place_link}
              onChange={ev => update('place_link', ev.target.value)}
            />
          </Transition>
        </div>
        <div className="max-w-lg">
          <div className="mb-1 flex items-center justify-between">
            <Label margin="" name="section" text="Evento" />
            <button
              type="button"
              onClick={handleNewSection}
              className="hover:underline text-blue-500 text-sm">
              Crear nuevo evento
            </button>
          </div>
          <Select
            name="section"
            isClearable
            className="react-select"
            options={sectionOptions}
            onChange={ev => update('section', ev)}
            value={form.section}
            noOptionsMessage={() => 'Ningún evento para esta búsqueda'}
            placeholder="Selecciona un evento"
          />
        </div>
        <div className="max-w-lg">
          <Label text="Etiquetas" />
          <TagsInput
            value={form.tags}
            onChange={ev => update('tags', ev)}
            placeholder="Introduce etiquetas separadas por comas"
          />
        </div>
        <div>
          <div className="mb-4 flex space-x-2 items-baseline">
            <Label name="seats" margin="" text="Jugadores" />
            <span className="flex-shrink-0">{form?.players.length || 0} /</span>
            <div className="w-20" title="Plazas totales">
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
          <AvatarList onItemClick={handleRemovePlayer} users={form?.players} />
          <button
            type="button"
            onClick={handleNewUser}
            className="mt-2 hover:underline text-blue-500 text-sm">
            Crear usuario invitado
          </button>
          {form?.players.length < form.seats && <AddUserInput onAdd={handleAddPlayer} />}
        </div>
        <div className="pt-4 h-full editor-wrapper">
          <Label name="" text="Descripción" />
          <TextEditor
            imageEditorPath="/editor/posts"
            value={post?.description}
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
          <span title="Rellena nombre, juego y fecha para guardar">
            <Button
              disabled={loading || !formValid}
              type="submit"
              border="border-none"
              color="text-white"
              background="bg-red-500 hover:bg-red-600">
              Guardar
            </Button>
          </span>
        </section>
      </form>
    </main>
  )
}
