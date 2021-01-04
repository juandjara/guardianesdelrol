import { firebase } from '@/lib/firebase'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'

const LOGIN_EMAIL_KEY = 'loginEmail'

// cheap typing
const initialContext = {
  loading: true,
  user: null,
  googleSignIn: async () => {},
  emailSignIn: async () => {},
  completeEmailSignIn: async () => {},
  anonSignIn: async () => {},
  signOut: async () => {},
  isEmailRegistered: async () => {}
}

const AuthContext = createContext(initialContext)

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}

function useAuthContextValue() {
  const [user, setUser] = useState(initialContext.user)
  const [loading, setLoading] = useState(initialContext.loading)

  async function googleSignIn() {
    const res = await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
    setUser(res.user)
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

  async function emailSignIn({ email, name, next }) {
    const { protocol, host } = window.location
    await firebase.auth().sendSignInLinkToEmail(email, {
      url: `${protocol}//${host}/loginCallback?next=${next}&displayName=${name}`,
      handleCodeInApp: true
    })
    window.localStorage.setItem(LOGIN_EMAIL_KEY, email)
  }

  async function completeEmailSignIn(name) {
    const validURL = firebase.auth().isSignInWithEmailLink(window.location.href)
    if (!validURL) {
      throw new Error('Enlace de autenticación inválido')
    }

    let email = window.localStorage.getItem(LOGIN_EMAIL_KEY)
    if (!email) {
      email = window.prompt('Por favor, vuelve a introducir tu email')
    }

    const res = await firebase.auth().signInWithEmailLink(email, window.location.href)
    if (name) {
      await res.user.updateProfile({ displayName: name })
    }
    window.localStorage.removeItem(LOGIN_EMAIL_KEY)
    setUser(res.user)
  }

  async function isEmailRegistered(email) {
    const res = await firebase.auth().fetchSignInMethodsForEmail(email)
    return res.length > 0
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
    completeEmailSignIn,
    anonSignIn,
    signOut,
    isEmailRegistered
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
        router.replace({
          pathname: '/login',
          query: {
            next: router.asPath
          }
        })
      }
    }, [user, loading, router])

    return <Component {...props} />
  }
}
