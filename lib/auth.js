import { firebase } from '@/lib/firebase'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function useAuth() {
  const { loading, user, anonSignIn, googleSignIn, signOut } = useContext(AuthContext)
  return {
    loading,
    user,
    anonSignIn,
    googleSignIn,
    signOut
  }
}

function useAuthContextValue() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function googleSignIn() {
    try {
      const res = await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
      setUser(res.user)
    } catch (err) {
      console.error(err)
    }
  }

  async function anonSignIn() {
    const res = await firebase.auth().signInAnonymously()
    setUser(res.user)
  }

  async function signOut() {
    await firebase.auth().signOut()
    setUser(null)
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged(user => {
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
    signOut
  }
}

export function AuthProvider({ children }) {
  const auth = useAuthContextValue()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function withAuthGuard(Component) {
  return function AuthGuardWrapper(props) {
    const { user, loading } = useAuth()
    const router = useRouter()
    useEffect(() => {
      if (!user && !loading) {
        router.replace(
          {
            pathname: '/login',
            query: {
              next: router.asPath
            }
          },
          undefined,
          { shallow: true }
        )
      }
    }, [user, loading, router])

    return <Component {...props} />
  }
}
