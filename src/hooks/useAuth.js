import { useCallback, useState } from 'react'
import { AUTH_VIEWS, DEMO_EMAIL, DEMO_PASSWORD } from '../constants/auth'

/* Client-side only: state lives in memory, so a page reload signs the user back out.
   Every action returns an error string or null so screens can render their own message
   without reaching into the hook's state. */
export function useAuth() {
  const [authed, setAuthed] = useState(false)
  const [view, setView] = useState(AUTH_VIEWS.login)
  const [account, setAccount] = useState({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
  const [pendingEmail, setPendingEmail] = useState('')
  const [notice, setNotice] = useState(null)

  const signIn = useCallback(
    (email, password) => {
      const matches =
        email.trim().toLowerCase() === account.email && password === account.password
      if (!matches) return 'Incorrect email or password.'
      setNotice(null)
      setAuthed(true)
      return null
    },
    [account],
  )

  const requestCode = useCallback(
    (email) => {
      const normalized = email.trim().toLowerCase()
      if (normalized !== account.email) return 'No account found for that email address.'
      setPendingEmail(normalized)
      setNotice(null)
      setView(AUTH_VIEWS.otp)
      return null
    },
    [account],
  )

  /* No code to verify against — the screen only gates on all six boxes being filled. */
  const verifyCode = useCallback(() => {
    setView(AUTH_VIEWS.reset)
    return null
  }, [])

  const resetPassword = useCallback((password) => {
    /* Updates the in-memory account, so the new password is what signs you in next. */
    setAccount((prev) => ({ ...prev, password }))
    setPendingEmail('')
    setNotice('Password updated. Sign in with your new password.')
    setView(AUTH_VIEWS.login)
    return null
  }, [])

  const goTo = useCallback((next) => {
    setNotice(null)
    setView(next)
  }, [])

  const signOut = useCallback(() => {
    setAuthed(false)
    setPendingEmail('')
    setNotice(null)
    setView(AUTH_VIEWS.login)
  }, [])

  return {
    authed,
    view,
    pendingEmail,
    notice,
    signIn,
    requestCode,
    verifyCode,
    resetPassword,
    goTo,
    signOut,
  }
}
