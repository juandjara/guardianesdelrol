import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Label from '@/components/Label'
import TextEditor from '@/components/TextEditor'
import Title from '@/components/Title'
import ImageUploader from '@/components/ImageUploader'
import { supabase } from '@/lib/data/supabase'
import useGameDetail from '@/lib/data/useGameDetail'
import useStateEffect from '@/lib/useStateEffect'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function CatalogEdit() {
  const router = useRouter()
  const id = router.query.id
  const { data: game } = useGameDetail(id)

  const [loading, setLoading] = useState(false)
  const [name, setName] = useStateEffect(game?.name)

  async function handleSubmit(ev) {
    ev.preventDefault()

    setLoading(true)
    const { data, error } = await supabase.from('games').update({ name }).match({ id })
    setLoading(false)
    if (error) {
      window.alert(error)
    } else {
      console.log(data)
      router.push(`/catalog/${game.id}/${game.slug}`)
    }
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
        className="bg-white text-gray-700 space-y-6 mt-2 px-4 py-6 rounded-lg relative">
        <div>
          <Label text="Imagen" />
          <ImageUploader />
        </div>
        <div>
          <Label name="name" text="Nombre" />
          <input
            id="name"
            type="text"
            className="w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
            placeholder="Nombre"
            value={name || ''}
            onChange={ev => setName(ev.target.value)}
            required
          />
        </div>
        <div className="h-full editor-wrapper">
          <Label name="" text="Descripción" />
          {game ? (
            <TextEditor value={game.description} />
          ) : (
            <div className="h-32 w-full rounded-lg border border-gray-300"></div>
          )}
        </div>
        <div className="flex justify-end items-center space-x-2">
          <Button disabled={loading} type="button" border="border-none" color="text-red-900">
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
