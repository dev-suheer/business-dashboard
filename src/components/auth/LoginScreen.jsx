import { useState } from 'react'
import AuthField from './AuthField'
import AuthLayout from './AuthLayout'
import AuthNotice from './AuthNotice'
import AuthSubmit from './AuthSubmit'

export default function LoginScreen({ notice, onSignIn, onForgot }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    setError(onSignIn(email, password))
  }

  return (
    <AuthLayout title="Sign in" subtitle="Use your console credentials to continue.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error ? (
          <AuthNotice>{error}</AuthNotice>
        ) : (
          notice && <AuthNotice tone="success">{notice}</AuthNotice>
        )}

        <AuthField
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          autoComplete="username"
          invalid={Boolean(error)}
        />

        <AuthField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          autoComplete="current-password"
          invalid={Boolean(error)}
          action={
            <button
              type="button"
              onClick={onForgot}
              className="text-[11.5px] text-emerald-soft hover:text-emerald transition-colors"
            >
              Forgot password?
            </button>
          }
        />

        <div className="pt-1">
          <AuthSubmit>Sign in</AuthSubmit>
        </div>
      </form>
    </AuthLayout>
  )
}
