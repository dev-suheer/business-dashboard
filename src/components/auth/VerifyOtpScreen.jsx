import { useEffect, useState } from 'react'
import { OTP_LENGTH, RESEND_COOLDOWN } from '../../constants/auth'
import AuthLayout from './AuthLayout'
import AuthNotice from './AuthNotice'
import AuthSubmit, { AuthBackLink } from './AuthSubmit'
import OtpInput from './OtpInput'

export default function VerifyOtpScreen({ email, onVerify, onBack }) {
  const [code, setCode] = useState('')
  const [resent, setResent] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN)

  useEffect(() => {
    if (cooldown <= 0) return undefined
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  /* Unfilled boxes are spaces in the backing string. */
  const entered = code.replace(/\s/g, '')
  const complete = entered.length === OTP_LENGTH

  const submit = (e) => {
    e.preventDefault()
    /* Any six digits are accepted — there is no code to check against. */
    onVerify()
  }

  const resend = () => {
    setCooldown(RESEND_COOLDOWN)
    setResent(true)
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`Enter the six-digit code we sent to ${email}.`}
      footer={<AuthBackLink onClick={onBack} />}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {resent && <AuthNotice tone="success">A new code is on its way.</AuthNotice>}

        <OtpInput value={code} onChange={setCode} />

        <div className="flex items-center justify-between gap-3">
          <p className="text-[11.5px] text-mut">
            {entered.length}/{OTP_LENGTH} entered
          </p>
          <button
            type="button"
            onClick={resend}
            disabled={cooldown > 0}
            className="text-[11.5px] text-emerald-soft hover:text-emerald transition-colors disabled:text-mut disabled:cursor-not-allowed disabled:hover:text-mut"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
          </button>
        </div>

        <div className="pt-1">
          <AuthSubmit disabled={!complete}>Verify code</AuthSubmit>
        </div>
      </form>
    </AuthLayout>
  )
}
