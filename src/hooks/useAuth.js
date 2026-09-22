import { useCallback, useEffect, useRef, useState } from 'react'
import { currentUser, login, logout } from '../api/client'

/* The cookie lives 60 minutes with no renewal; warn 5 minutes before it runs out. */
const WARN_AFTER_MS = 55 * 60 * 1000

/* Session state backed by the API's HttpOnly cookie. JavaScript cannot read the cookie,
   so `/login/me` on mount is the only way to know whether a session is still alive.
   signIn returns an error string or null so the screen can render its own message. */
export function useAuth() {
  const [checking, setChecking] = useState(true)
  const [username, setUsername] = useState(null)
  const [notice, setNotice] = useState(null)
  const [expiringSoon, setExpiringSoon] = useState(false)
  const warnTimer = useRef(null)

  const clearWarning = useCallback(() => {
    clearTimeout(warnTimer.current)
    warnTimer.current = null
    setExpiringSoon(false)
  }, [])

  useEffect(() => {
    let cancelled = false
    currentUser()
      .then((user) => {
        if (!cancelled) setUsername(user?.username ?? null)
      })
      .catch(() => {
        if (!cancelled) setUsername(null)
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })
    return () => {
      cancelled = true
      clearTimeout(warnTimer.current)
    }
  }, [])

  const signIn = useCallback(
    async (name, password) => {
      try {
        const user = await login(name.trim(), password)
        setNotice(null)
        setUsername(user.username)
        /* Only a fresh login has a known start time; a session restored via /me does not. */
        clearWarning()
        warnTimer.current = setTimeout(() => setExpiringSoon(true), WARN_AFTER_MS)
        return null
      } catch (err) {
        return err.message || 'Login failed'
      }
    },
    [clearWarning],
  )

  /* Logout is unauthenticated on the server, so it succeeds even on an expired session.
     Client state is cleared regardless of the outcome. */
  const signOut = useCallback(async () => {
    try {
      await logout()
    } catch {
      /* nothing to recover — the local session is dropped either way */
    }
    clearWarning()
    setNotice(null)
    setUsername(null)
  }, [clearWarning])

  /* Called by the API client on any 401. */
  const expire = useCallback(() => {
    clearWarning()
    setNotice('Your session has expired. Please log in again.')
    setUsername(null)
  }, [clearWarning])

  const dismissWarning = useCallback(() => setExpiringSoon(false), [])

  return {
    checking,
    authed: Boolean(username),
    username,
    notice,
    expiringSoon,
    dismissWarning,
    signIn,
    signOut,
    expire,
  }
}
