/* Mock credentials. There is no backend — the whole auth flow is client-side state, so
   these are the single source of truth for what will sign in. */
export const DEMO_EMAIL = 'admin@gmail.com'
export const DEMO_PASSWORD = '112233'

/* No mail is actually sent, so the verify step accepts any six digits. */
export const OTP_LENGTH = 6
export const MIN_PASSWORD_LENGTH = 6
export const RESEND_COOLDOWN = 30

export const AUTH_VIEWS = {
  login: 'login',
  forgot: 'forgot',
  otp: 'otp',
  reset: 'reset',
}
