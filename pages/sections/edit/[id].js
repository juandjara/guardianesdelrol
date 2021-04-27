import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Label from '@/components/Label'
import Title from '@/components/Title'
import ImageInput from '@/components/ImageInput'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { useAlert } from '@/components/AlertContext'
import dynamic from 'next/dynamic'
import { defaultImageState, imageReducer } from '@/lib/images/imageReducer'
import uploadImage from '@/lib/images/uploadImage'
import useAuthGuard from '@/lib/auth/useAuthGuard'
import { useQueryParams } from '@/lib/useQueryParams'
import useSections from '@/lib/useSections'
import { deleteSection, sectionToForm, upsertSection } from '@/lib/sections/sectionActions'
import { useRouter } from 'next/router'

const TextEditor = dynamic(() => import('@/components/TextEditor'), { ssr: false })

export default function CatalogEdit() {
  useAuthGuard()
  const router = useRouter()
  const { params } = useQueryParams()
  const id = Number(params.id)
  const { sections, mutate } = useSections()
  const section = sections.find(s => s.id === id)

  const { setAlert } = useAlert()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(() => sectionToForm(section))
  const [imageState, dispatch] = useReducer(imageReducer, defaultImageState(section))

  useEffect(() => {
    setForm(sectionToForm(section))
    dispatch({ type: 'RESET', payload: defaultImageState(section) })
  }, [section])

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

      const newSection = await upsertSection(id, {
        ...form,
        image,
        image_position: imageState.position
      })

      mutate()
      return router.push(`/sections/${newSection.id}`)
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }

    setLoading(false)
  }

  async function handleDelete() {
    setLoading(true)
    try {
      const confirmation = await deleteSection(id)
      if (confirmation) {
        mutate()
        return router.replace('/sections')
      }
    } catch (error) {
      console.error(error)
      setAlert(error.message)
    }
    setLoading(false)
  }

  const title = id ? `Editar evento` : 'Nuevo evento'
  const updateEditor = useCallback(value => update('description', value), [])

  return (
    <main className="flex-auto py-3 mx-auto max-w-3xl w-full">
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
        <div className="max-w-lg">
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
            imageEditorPath="/editor/sections"
            value={section?.description}
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
