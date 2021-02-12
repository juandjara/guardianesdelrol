import Label from '@/components/Label'
import TextEditor from '@/components/TextEditor'
import useGameDetail from '@/lib/data/useGameDetail'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function CatalogEdit() {
  const router = useRouter()
  const id = router.query.id
  const { data: game } = useGameDetail(id)

  const [name, setName] = useState(null)
  const nameValue = (name === null ? game?.name : name) || ''

  return (
    <main className="flex-auto mx-auto p-3 max-w-4xl w-full">
      <style>{`
      `}</style>
      <div className="bg-white text-gray-700 pb-6 rounded-lg relative">
        <div className="p-3">
          <Label name="name" text="Nombre" />
          <input
            id="email"
            type="email"
            className="w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
            placeholder="Nombre"
            value={nameValue}
            onChange={ev => setName(ev.target.value)}
            required
          />
        </div>
        <div className="p-3 h-full editor-wrapper">
          <Label name="" text="Descripción" />
          {game && <TextEditor value={game.description} />}
        </div>
      </div>
    </main>
  )
}
