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
import useSections, { createSection } from '@/lib/useSections'
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
import axios from 'axios'

const inputStyles =
  'w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
const TextEditor = dynamic(() => import('@/components/TextEditor'), { ssr: false })

function PlayerListInput({ form, handleAddPlayer, handleRemovePlayer }) {
  const [selected, setSelected] = useState(null)

  function handleSelect(user) {
    if (user.id === selected?.id) {
      setSelected(null)
    } else {
      setSelected(user)
    }
  }

  function handleRemove() {
    handleRemovePlayer(selected)
    setSelected(null)
  }

  return (
    <div className="max-w-lg relative">
      <div className="flex space-x-2 items-baseline">
        <Label text="Jugadores" />
        <span className="text-gray-500 text-base">
          {form?.players.length || 0} / {form.seats}
        </span>
      </div>
      <AddUserInput onAdd={handleAddPlayer} />
      <AvatarList
        selected={selected?.id}
        onSelect={handleSelect}
        users={form?.players}
        action={
          selected && (
            <Button small className="mb-2 ml-2" onClick={handleRemove}>
              Eliminar
            </Button>
          )
        }
      />
    </div>
  )
}

function AddUserInput({ onAdd }) {
  const { setAlert } = useAlert()
  const isMountedRef = useIsMounted()
  const [newUser, setNewUser] = useState(null)

  function handleClick() {
    onAdd(newUser)
    setNewUser(null)
  }

  async function handleNewUser() {
    const name = window.prompt('Introduzca el nombre del usuario invitado')
    if (!name) return
    try {
      const res = await axios.post('/api/createGuest', { name })
      if (isMountedRef.current) {
        onAdd(res.data)
      }
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }
  }

  return (
    <div className="mb-4">
      <div className="flex items-center">
        <Autocomplete
          id="new_player"
          placeholder="Buscar jugadores..."
          className="flex-auto"
          value={newUser}
          onChange={setNewUser}
          fetcher={fetchUsers}
          noDataMessage="Ning??n usuario para esta b??squeda"
        />
        <Button
          small
          disabled={!newUser}
          onClick={handleClick}
          type="button"
          hasIcon="left"
          background="bg-gray-100"
          color="text-gray-700"
          title="A??adir nuevo jugador"
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
          <span>A??adir</span>
        </Button>
      </div>
      <button
        type="button"
        onClick={handleNewUser}
        className="absolute -top-1 right-0 block mt-1 hover:underline text-blue-500 text-sm">
        Crear jugador invitado
      </button>
    </div>
  )
}

function Footnote({ className = '', children, ...props }) {
  return (
    <p className={`${className} text-xs text-gray-500 mt-1 ml-1`} {...props}>
      {children}
    </p>
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

  const { sections, mutate: mutateSections } = useSections()
  const sectionOptions = sections.map(s => ({ value: s.id, label: s.name }))
  const [placeURLOpen, setPlaceURLOpen] = useState(false)
  const formValid = form.name && form.date && form.game

  useEffect(() => {
    setPlaceURLOpen(!!post?.place_link)
    setForm(postToForm(post))
    dispatch({ type: 'RESET', payload: defaultImageState(post) })
  }, [post])

  function update(key, value) {
    setForm(form => ({ ...form, [key]: value }))
  }

  function handleAddPlayer(user) {
    setForm(form => ({
      ...form,
      players: form.players.concat(user),
      seats: Math.max(form.players.length + 1, form.seats)
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

  async function handleNewGame() {
    const name = window.prompt('Introduzca el nombre del nuevo juego')
    if (!name) return
    try {
      const game = await upsertGame(null, { name })
      if (isMountedRef.current) {
        update('game', game)
      }
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }
  }

  async function handleNewSection() {
    const name = window.prompt('Introduzca el nombre del nuevo evento')
    if (!name) return
    try {
      const section = await createSection(name)
      if (isMountedRef.current) {
        mutateSections()
        update('section', { label: section.name, value: section.id })
      }
    } catch (err) {
      console.error(err)
      setAlert(err.message)
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
          <Label name="name" text={required('T??tulo')} />
          <input
            id="name"
            type="text"
            className={inputStyles}
            placeholder="T??tulo de la partida"
            value={form.name}
            onChange={ev => update('name', ev.target.value)}
            required
          />
        </div>
        <div className="max-w-lg">
          <div className="mb-1 flex items-center justify-between">
            <Label margin={false} name="game" text={required('Juego')} />
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
            <Label margin={false} name="place" text="Lugar" />
            <button
              type="button"
              onClick={() => setPlaceURLOpen(!placeURLOpen)}
              className="hover:underline text-indigo-500 text-sm">
              {placeURLOpen ? 'Ocultar enlace' : 'A??adir enlace'}
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
            <div>
              <input
                id="place_link"
                type="url"
                className={`mt-1 ${inputStyles}`}
                placeholder="Enlace"
                value={form.place_link}
                onChange={ev => update('place_link', ev.target.value)}
              />
              <Footnote>
                Aqu?? puedes a??adir un enlace a discord, google maps, roll20, o cualquier cosa
              </Footnote>
            </div>
          </Transition>
        </div>
        <div className="max-w-lg">
          <div className="mb-1 flex items-center justify-between">
            <Label margin={false} name="section" text="Evento" />
            <button
              type="button"
              onClick={handleNewSection}
              className="hover:underline text-blue-500 text-sm">
              Crear evento nuevo
            </button>
          </div>
          <Select
            name="section"
            isClearable
            className="react-select"
            options={sectionOptions}
            onChange={ev => update('section', ev)}
            value={form.section}
            noOptionsMessage={() => 'Ning??n evento para esta b??squeda'}
            placeholder="Selecciona un evento"
          />
          <Footnote>Opcional</Footnote>
        </div>
        <div className="max-w-lg">
          <Label text="Etiquetas" />
          <TagsInput
            value={form.tags}
            onChange={ev => update('tags', ev)}
            placeholder="Introduce etiquetas separadas por comas"
          />
          <Footnote>Opcional</Footnote>
        </div>
        <div className="max-w-lg">
          <Label name="seats" text="Plazas totales" />
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
        <PlayerListInput
          form={form}
          handleAddPlayer={handleAddPlayer}
          handleRemovePlayer={handleRemovePlayer}
        />
        <div className="pt-4 h-full editor-wrapper">
          <Label name="" text="Descripci??n" />
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
