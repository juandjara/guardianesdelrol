import { useEffect, useRef, useState } from 'react'
import Button from '../Button'
import UserIcon from '../icons/UserIcon'

export default function AnonLoginForm({ onSubmit, onCancel }) {
  const [name, setName] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus()
    }
  }, [])

  function handleSubmit(ev) {
    ev.preventDefault()
    onSubmit(name)
  }

  return (
    <div className="text-left -mt-4 -mb-4 space-y-4">
      <p className="flex items-center text-md font-semibold space-x-2">
        <UserIcon height={20} width={20} />
        <span>Entrar como invitado</span>
      </p>
      <form onSubmit={handleSubmit} className="mt-2">
        <label className="text-sm text-gray-500 block mb-1" htmlFor="name">
          Nombre
        </label>
        <input
          ref={inputRef}
          id="name"
          className="w-full h-10 px-3 text-base placeholder-gray-500 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-900 focus:border-red-900"
          placeholder="Escribe tu nombre"
          value={name}
          onChange={ev => setName(ev.target.value)}
          required
        />
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            onClick={onCancel}
            type="button"
            className="mx-0 my-0 border-none"
            color="color-gray-700"
            background="bg-white hover:bg-gray-100"
            border="border-gray-300">
            Cancelar
          </Button>
          <Button
            type="submit"
            className="mx-0 my-0 shadow-md border-none"
            color="text-white"
            background="bg-red-500 hover:bg-red-600">
            Continuar
          </Button>
        </div>
      </form>
    </div>
  )
}
