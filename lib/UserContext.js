import { useAlert } from '@/lib/AlertContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'

function getURLParameter(name, url) {
  if (!url) url = window.location.href
  var regex = new RegExp('[?&#]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

const UserContext = createContext(supabase.auth.session())

export function UserContextProvider(props) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const { setAlert } = useAlert()
  const router = useRouter()

  async function fetchProfile(id) {
    if (!id) {
      return
    }
    const { data, error } = await supabase
      .from('users_with_permissions')
      .select(
        `displayName:display_name,
        photoURL:photo_url,
        challengeable,
        bio,
        role`
      )
      .match({ id })
      .single()
    if (error) {
      console.error(error)
      setAlert(error.message)
    } else {
      setProfile(data)
    }
  }

  async function updateProfile({ id, bio, photoURL, displayName, challengeable }) {
    const { error } = await supabase
      .from('users')
      .update({
        photoURL,
        display_name: displayName,
        challengeable,
        bio
      })
      .match({ id })
      .single()
    if (error) {
      console.error(error)
      setAlert(error.message)
    } else {
      await fetchProfile(id)
    }
  }

  useEffect(() => {
    const savedSession = supabase.auth.session()
    setSession(savedSession)

    const type = window.location.hash && getURLParameter('type')
    if (type) {
      router.push(`/me?type=${type}`)
    }

    fetchProfile(savedSession?.user?.id)
    const { data: listener } = supabase.auth.onAuthStateChange((type, newSession) => {
      if (newSession && type === 'USER_UPDATED') {
        newSession.user = supabase.auth.user()
      }
      if (newSession?.user?.id !== session?.user?.id || type === 'USER_UPDATED') {
        fetchProfile(newSession?.user?.id)
      }
      setSession(newSession)
    })
    return () => listener.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const context = {
    ...(session || {}),
    user: session?.user && { ...session.user, ...profile },
    updateProfile
  }

  return <UserContext.Provider value={context} {...props} />
}

export function useSession() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useSession must be used within a UserContextProvider.`)
  }

  return context
}
