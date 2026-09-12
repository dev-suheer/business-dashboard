import { useCallback, useState } from 'react'
import AuthFlow from './components/auth/AuthFlow'
import './components/charts/chartSetup'
import DashboardScreen from './components/dashboard/DashboardScreen'
import IntakeScreen from './components/intake/IntakeScreen'
import ProcessingOverlay from './components/processing/ProcessingOverlay'
import { dataset } from './data/generateDataset'
import { useAuth } from './hooks/useAuth'
import { useFileIntake } from './hooks/useFileIntake'
import { formatRunDate } from './utils/format'

export default function App() {
  const auth = useAuth()
  const [screen, setScreen] = useState('intake')
  const [processing, setProcessing] = useState(false)
  const [runMeta, setRunMeta] = useState('')
  const { files, ready, hint, selectFile, clearFile, reset } = useFileIntake()

  const reveal = useCallback(() => {
    setProcessing(false)
    setScreen('dashboard')
    setRunMeta('Run ' + formatRunDate(new Date()) + ' · ' + dataset.items.length + ' records')
    window.scrollTo(0, 0)
  }, [])

  const restart = useCallback(() => {
    setScreen('intake')
    setProcessing(false)
    reset()
    window.scrollTo(0, 0)
  }, [reset])

  /* Signing out also clears the run, so the next session starts from an empty intake. */
  const signOut = useCallback(() => {
    setScreen('intake')
    setProcessing(false)
    reset()
    auth.signOut()
    window.scrollTo(0, 0)
  }, [auth, reset])

  if (!auth.authed) return <AuthFlow auth={auth} />

  return (
    <>
      {screen === 'intake' && (
        <IntakeScreen
          files={files}
          ready={ready}
          hint={hint}
          onSelect={selectFile}
          onClear={clearFile}
          onStart={() => setProcessing(true)}
          onSignOut={signOut}
        />
      )}

      {screen === 'dashboard' && (
        <DashboardScreen runMeta={runMeta} onRestart={restart} onSignOut={signOut} />
      )}

      <ProcessingOverlay active={processing} onComplete={reveal} />
    </>
  )
}
