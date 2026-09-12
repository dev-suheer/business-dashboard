import { useCallback, useState } from 'react'
import './components/charts/chartSetup'
import DashboardScreen from './components/dashboard/DashboardScreen'
import IntakeScreen from './components/intake/IntakeScreen'
import ProcessingOverlay from './components/processing/ProcessingOverlay'
import { dataset } from './data/generateDataset'
import { useFileIntake } from './hooks/useFileIntake'
import { formatRunDate } from './utils/format'

export default function App() {
  const [screen, setScreen] = useState('intake')
  const [processing, setProcessing] = useState(false)
  const [runMeta, setRunMeta] = useState('')
  const { files, ready, hint, selectFile, clearFile, reset } = useFileIntake()

  const reveal = useCallback(() => {
    setProcessing(false)
    setScreen('dashboard')
    setRunMeta(
      'Run ' + formatRunDate(new Date()) + ' · ' + dataset.items.length + ' records',
    )
    window.scrollTo(0, 0)
  }, [])

  const restart = useCallback(() => {
    setScreen('intake')
    setProcessing(false)
    reset()
    window.scrollTo(0, 0)
  }, [reset])

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
        />
      )}

      {screen === 'dashboard' && <DashboardScreen runMeta={runMeta} onRestart={restart} />}

      <ProcessingOverlay active={processing} onComplete={reveal} />
    </>
  )
}
