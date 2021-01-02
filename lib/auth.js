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

  async function emailSignIn(email, next) {
    const { protocol, host } = window.location
    await firebase.auth().sendSignInLinkToEmail(email, {
      url: `${protocol}//${host}/loginCallback?next=${next}`,
      handleCodeInApp: true
    })
    window.localStorage.setItem('loginEmail', email)
  }

  async function anonSignIn(name) {
    const res = await firebase.auth().signInAnonymously()
    await res.user.updateProfile({ displayName: name })
    setUser(res.user)
  }

  async function signOut() {
    const user = firebase.auth().currentUser
    if (user.isAnonymous) {
      await user.delete() // this also triggers a sign out
    } else {
      await firebase.auth().signOut()
    }
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
    googleSignIn,
    emailSignIn,
    anonSignIn,
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