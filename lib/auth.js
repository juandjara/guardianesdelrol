import { firebase } from '@/lib/firebase'
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext()

export function useAuth () {
  return useContext(AuthContext)
}

function useAuthContext () {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function googleSignIn () {
    const res = await firebase.auth().signInWithPopup(new firebase.auth.GoogleProvider())
    setUser(res.user)
  }

  async function anonSignIn () {
    const res = await firebase.auth().signInAnonymously()
    setUser(res.user)
  }

  async function signOut () {
    await firebase.auth().signOut()
    setUser(null)
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged(user => {
      console.log('id token change', user)
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return {
    loading,
    user,
    anonSignIn,
    googleSignIn,
    signOut,
  }
}

export function AuthProvider ({ children }) {
  const auth = useAuthContext()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function withAuthGuard (Component) {
  return function AuthGuardWrapper (props) {
    const { user, loading } = useAuth()
    const router = useRouter()
    useEffect(() => {
      if (!user && !loading) {
        router.replace({
          pathname: '/login',
          query: {
            next: router.asPath
          }
        }, undefined, { shallow: true })
      }
    }, [user, loading])

    return <Component {...props} />
  }
}


