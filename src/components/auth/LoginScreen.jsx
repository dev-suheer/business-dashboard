import { useState } from 'react'
import AuthField from './AuthField'
import AuthLayout from './AuthLayout'
import AuthNotice from './AuthNotice'
import AuthSubmit from './AuthSubmit'

export default function LoginScreen({ notice, onSignIn }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (pending) return
    if (!username.trim() || !password) {
      setError('Enter your username and password.')
      return
    }
    setPending(true)
    const problem = await onSignIn(username, password)
    /* On success this screen unmounts, so only touch state on failure. */
    if (problem) {
      setError(problem)
      setPending(false)
    }
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
          id="username"
          label="Username"
          type="text"
          value={username}
          onChange={setUsername}
          placeholder="Enter your username"
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
        />

        <div className="pt-1">
          <AuthSubmit disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</AuthSubmit>
        </div>
      </form>
    </AuthLayout>
  )
}
