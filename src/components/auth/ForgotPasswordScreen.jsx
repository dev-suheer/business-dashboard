import { useState } from 'react'
import AuthField from './AuthField'
import AuthLayout from './AuthLayout'
import AuthNotice from './AuthNotice'
import AuthSubmit, { AuthBackLink } from './AuthSubmit'

export default function ForgotPasswordScreen({ onRequestCode, onBack }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Enter the email on your account.')
      return
    }
    setError(onRequestCode(email))
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter the email on your account and we'll send a six-digit verification code."
      footer={<AuthBackLink onClick={onBack} />}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && <AuthNotice>{error}</AuthNotice>}

        <AuthField
          id="reset-email"
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          autoComplete="username"
          invalid={Boolean(error)}
        />

        <div className="pt-1">
          <AuthSubmit>Send code</AuthSubmit>
        </div>
      </form>
    </AuthLayout>
  )
}
