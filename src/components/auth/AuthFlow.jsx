import LoginScreen from './LoginScreen'

/* The service has exactly one account and no password-reset endpoints, so login is the
   only auth screen. */
export default function AuthFlow({ auth }) {
  return <LoginScreen notice={auth.notice} onSignIn={auth.signIn} />
}
