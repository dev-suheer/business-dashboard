import { useState } from 'react'
import { MIN_PASSWORD_LENGTH } from '../../constants/auth'
import AuthField from './AuthField'
import AuthLayout from './AuthLayout'
import AuthNotice from './AuthNotice'
import AuthSubmit, { AuthBackLink } from './AuthSubmit'

export default function ResetPasswordScreen({ onReset, onBack }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`)
      return
    }
    if (password !== confirm) {
      setError('Those passwords do not match.')
      return
    }
    setError(onReset(password))
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a password you haven't used on this account before."
      footer={<AuthBackLink onClick={onBack} />}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && <AuthNotice>{error}</AuthNotice>}

        <AuthField
          id="new-password"
          label="New password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          autoComplete="new-password"
          invalid={Boolean(error)}
        />

        <AuthField
          id="confirm-password"
          label="Confirm password"
          type="password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Re-enter your new password"
          autoComplete="new-password"
          invalid={Boolean(error)}
        />

        <div className="pt-1">
          <AuthSubmit icon="check">Update password</AuthSubmit>
        </div>
      </form>
    </AuthLayout>
  )
}
