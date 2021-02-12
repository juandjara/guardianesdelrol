import IconGoogle from '@/components/social-icons/google.svg'
import { useAlert } from '@/components/AlertContext'
import { supabase } from '@/lib/data/supabase'
import { useState } from 'react'
import Button from '../Button'
import Spinner from '../Spinner'

export default function GoogleLoginButton({ onLoggedIn = () => {} }) {
  const [loading, setLoading] = useState()
  const { setAlert } = useAlert()

  async function login() {
    setLoading(true)
    const { error } = await supabase.auth.signIn({ provider: 'google' })
    if (error) {
      console.error(error)
      setAlert(error.message)
    } else {
      onLoggedIn()
    }
    setLoading(false)
  }

  return (
    <Button
      type="button"
      onClick={login}
      disabled={loading}
      hasIcon="left"
      className="w-full mx-0 my-0"
      color="text-gray-700"
      background="bg-white hover:shadow-md"
      border="border-gray-200 hover:border-gray-300">
      {loading ? <Spinner size={6} color="white" /> : <IconGoogle width={20} height={20} />}
      <span>Entrar con Google</span>
    </Button>
  )
}
