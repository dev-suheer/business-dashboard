import { AUTH_VIEWS } from '../../constants/auth'
import ForgotPasswordScreen from './ForgotPasswordScreen'
import LoginScreen from './LoginScreen'
import ResetPasswordScreen from './ResetPasswordScreen'
import VerifyOtpScreen from './VerifyOtpScreen'

export default function AuthFlow({ auth }) {
  const { view, notice, pendingEmail, signIn, requestCode, verifyCode, resetPassword, goTo } = auth
  const backToLogin = () => goTo(AUTH_VIEWS.login)

  if (view === AUTH_VIEWS.forgot) {
    return <ForgotPasswordScreen onRequestCode={requestCode} onBack={backToLogin} />
  }

  if (view === AUTH_VIEWS.otp) {
    return (
      <VerifyOtpScreen
        email={pendingEmail}
        onVerify={verifyCode}
        onBack={() => goTo(AUTH_VIEWS.forgot)}
      />
    )
  }

  if (view === AUTH_VIEWS.reset) {
    return <ResetPasswordScreen onReset={resetPassword} onBack={backToLogin} />
  }

  return (
    <LoginScreen
      notice={notice}
      onSignIn={signIn}
      onForgot={() => goTo(AUTH_VIEWS.forgot)}
    />
  )
}
