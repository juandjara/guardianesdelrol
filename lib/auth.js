import { firebase } from '@/lib/firebase'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
const Login = dynamic(() => import('@/pages/login'))

const LOGIN_EMAIL_KEY = 'loginEmail'

// cheap typing
const initialContext = {
  loading: true,
  user: null,
  setUser: () => {}
}

const AuthContext = createContext(initialContext)

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}

function useAuthContextValue() {
  const [user, setUser] = useState(initialContext.user)
  const [loading, setLoading] = useState(initialContext.loading)

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged(async user => {
      const userData = user && user.toJSON()
      if (userData) {
        const { claims } = await user.getIdTokenResult()
        userData.superadmin = claims.superadmin
        userData.admin = claims.admin
      }
      setUser(userData)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return {
    loading,
    user,
    setUser
  }
}

export function AuthProvider({ children }) {
  const auth = useAuthContextValue()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function withAuthGuard(Component) {
  return function AuthGuardWrapper(props) {
    const { user, loading } = useAuth()
    const notLoggedIn = !user && !loading
    const router = useRouter()
    useEffect(() => {
      if (notLoggedIn) {
        router.replace(
          router.asPath,
          {
            pathname: '/login',
            query: {
              next: router.asPath
            }
          },
          { shallow: true }
        )
      }
    }, [notLoggedIn, router])

    return notLoggedIn ? <Login /> : <Component {...props} />
  }
}

export async function googleSignIn() {
  const res = await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
  return res.user.toJSON()
}

export async function anonSignIn(name) {
  const res = await firebase.auth().signInAnonymously()
  await res.user.updateProfile({ displayName: name })
  return res.user.toJSON()
}

export async function signOut() {
  const user = firebase.auth().currentUser
  // onIdTokenChanged is triggered after calling any of those methods
  if (user.isAnonymous) {
    await user.delete() // this also triggers a sign out
  } else {
    await firebase.auth().signOut()
  }
}

export async function emailSignIn({ email, name, next }) {
  const { protocol, host } = window.location
  await firebase.auth().sendSignInLinkToEmail(email, {
    url: `${protocol}//${host}/loginCallback?next=${next || ''}&displayName=${name || ''}`,
    handleCodeInApp: true
  })
  window.localStorage.setItem(LOGIN_EMAIL_KEY, email)
}

export async function completeEmailSignIn(name) {
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
  return res.user.toJSON()
}

export async function isEmailRegistered(email) {
  const res = await firebase.auth().fetchSignInMethodsForEmail(email)
  return res.length > 0
}
