import { useCallback, useEffect, useRef, useState } from 'react'
import { reconcile, SessionExpiredError, setSessionExpiredHandler } from './api/client'
import AuthFlow from './components/auth/AuthFlow'
import './components/charts/chartSetup'
import DashboardScreen from './components/dashboard/DashboardScreen'
import IntakeScreen from './components/intake/IntakeScreen'
import ProcessingOverlay from './components/processing/ProcessingOverlay'
import { useAuth } from './hooks/useAuth'
import { useFileIntake } from './hooks/useFileIntake'

export default function App() {
  const auth = useAuth()
  const [screen, setScreen] = useState('intake')
  const [processing, setProcessing] = useState(false)
  /* The API persists nothing — this response is the only copy of the result. */
  const [result, setResult] = useState(null)
  const [runError, setRunError] = useState(null)
  const controllerRef = useRef(null)
  const { files, ready, hint, selectFile, clearFile, reset } = useFileIntake()

  /* Any 401 routes back to login. Selected files are deliberately kept so the user can
     sign in again and resubmit without re-picking them. */
  const { expire } = auth
  useEffect(() => {
    setSessionExpiredHandler(() => {
      controllerRef.current?.abort()
      setProcessing(false)
      setResult(null)
      setScreen('intake')
      expire()
    })
  }, [expire])

  const start = useCallback(async () => {
    if (processing) return
    const controller = new AbortController()
    controllerRef.current = controller
    setRunError(null)
    setProcessing(true)
    try {
      const data = await reconcile(files, controller.signal)
      setResult(data)
      setScreen('dashboard')
      window.scrollTo(0, 0)
    } catch (err) {
      if (err.name !== 'AbortError' && !(err instanceof SessionExpiredError)) {
        /* `field` lets the intake show the message next to the picker it names. */
        setRunError({ field: err.field ?? null, message: err.message || 'Reconciliation failed' })
      }
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null
      setProcessing(false)
    }
  }, [files, processing])

  const cancel = useCallback(() => controllerRef.current?.abort(), [])

  /* A field's server error no longer applies once that file changes. */
  const clearFieldError = useCallback((key) => {
    setRunError((prev) => (prev?.field === key ? null : prev))
  }, [])

  const handleSelect = useCallback(
    (key, file) => {
      clearFieldError(key)
      selectFile(key, file)
    },
    [clearFieldError, selectFile],
  )

  const handleClear = useCallback(
    (key) => {
      clearFieldError(key)
      clearFile(key)
    },
    [clearFieldError, clearFile],
  )

  const restart = useCallback(() => {
    setScreen('intake')
    setProcessing(false)
    setResult(null)
    setRunError(null)
    reset()
    window.scrollTo(0, 0)
  }, [reset])

  /* Signing out also clears the run, so the next session starts from an empty intake. */
  const signOut = useCallback(() => {
    controllerRef.current?.abort()
    setScreen('intake')
    setProcessing(false)
    setResult(null)
    setRunError(null)
    reset()
    auth.signOut()
    window.scrollTo(0, 0)
  }, [auth, reset])

  if (auth.checking) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="h-10 w-10 rounded-full border-2 border-line border-t-emerald-soft spin" />
      </div>
    )
  }

  if (!auth.authed) return <AuthFlow auth={auth} />

  return (
    <>
      {auth.expiringSoon && (
        <div
          role="status"
          className="flex items-center justify-center gap-3 px-4 py-2 bg-warn/15 border-b border-warn/30 text-[12.5px] text-warn"
        >
          <span>
            Your session ends in about 5 minutes. Download the report if you need a copy.
          </span>
          <button
            type="button"
            onClick={auth.dismissWarning}
            className="underline underline-offset-2 hover:text-txt"
          >
            Dismiss
          </button>
        </div>
      )}

      {screen === 'intake' && (
        <IntakeScreen
          files={files}
          ready={ready}
          hint={hint}
          error={runError}
          busy={processing}
          username={auth.username}
          onSelect={handleSelect}
          onClear={handleClear}
          onStart={start}
          onSignOut={signOut}
        />
      )}

      {screen === 'dashboard' && result && (
        <DashboardScreen
          result={result}
          files={files}
          username={auth.username}
          onRestart={restart}
          onSignOut={signOut}
        />
      )}

      <ProcessingOverlay active={processing} onCancel={cancel} />
    </>
  )
}
