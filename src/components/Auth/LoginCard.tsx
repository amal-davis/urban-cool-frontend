import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthApiError, sendOtp, verifyOtp } from '../../lib/authApi'
import { MobileNumberStep } from './MobileNumberStep'
import { OtpStep } from './OtpStep'
import './LoginCard.css'

type Step = 'phone' | 'otp'

// Used only until the first sendOtp() response comes back with the
// backend's real otp_length/resend_after — see handleSendOtp below.
const DEFAULT_OTP_LENGTH = 6

function messageFor(error: unknown, fallback: string): string {
  return error instanceof AuthApiError ? error.message : fallback
}

/**
 * Owns all auth-flow state (current step, phone, OTP, the three independent
 * loading flags, the resend timer, and both error slots) and renders
 * exactly one step at a time — MobileNumberStep and OtpStep are never both
 * mounted together, per the "don't show both forms at once" requirement.
 * The two step components stay presentational; every API call and every
 * state transition lives here.
 */
export function LoginCard() {
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpLength, setOtpLength] = useState(DEFAULT_OTP_LENGTH)

  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)

  const [sendError, setSendError] = useState<string | null>(null)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  const [resendSeconds, setResendSeconds] = useState(0)
  const timerRef = useRef<number | null>(null)

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  function startResendTimer(seconds: number) {
    clearTimer()
    setResendSeconds(seconds)
    // One interval at a time — clearTimer() above guarantees the previous
    // one is gone before this one starts, so resend/send can never stack
    // multiple concurrent countdowns.
    timerRef.current = window.setInterval(() => {
      setResendSeconds((current) => {
        if (current <= 1) {
          clearTimer()
          return 0
        }
        return current - 1
      })
    }, 1000)
  }

  // Cleans up the interval if the user navigates away mid-countdown.
  useEffect(() => clearTimer, [])

  async function handleSendOtp(localNumber: string) {
    setSendError(null)
    setSendingOtp(true)
    try {
      const result = await sendOtp(localNumber)
      setPhone(localNumber)
      setOtp('')
      setOtpLength(result.otpLength)
      setVerifyError(null)
      setStep('otp')
      startResendTimer(result.resendAfter)
    } catch (error) {
      setSendError(messageFor(error, 'Could not send OTP. Please try again.'))
    } finally {
      setSendingOtp(false)
    }
  }

  async function handleResend() {
    if (resendSeconds > 0 || resending) return
    setVerifyError(null)
    setResending(true)
    try {
      const result = await sendOtp(phone)
      setOtp('')
      setOtpLength(result.otpLength)
      startResendTimer(result.resendAfter)
    } catch (error) {
      // A 429 from the resend cooldown carries how long is actually left —
      // resync the visible timer to it instead of leaving the button
      // enabled with a stale "0" that would just 429 again.
      if (error instanceof AuthApiError && error.retryAfter) {
        startResendTimer(error.retryAfter)
      }
      setVerifyError(messageFor(error, 'Could not resend OTP. Please try again.'))
    } finally {
      setResending(false)
    }
  }

  async function handleVerify(code: string) {
    setVerifyError(null)
    setVerifying(true)
    try {
      await verifyOtp(phone, code)
      // Session cookie is already set by the backend at this point (see
      // authApi.ts) — nothing left to store client-side before redirecting.
      navigate('/', { replace: true })
    } catch (error) {
      setVerifyError(messageFor(error, 'Something went wrong. Please try again.'))
    } finally {
      setVerifying(false)
    }
  }

  function handleChangeNumber() {
    setStep('phone')
    setOtp('')
    setVerifyError(null)
    clearTimer()
    setResendSeconds(0)
  }

  return (
    <div className="auth-card">
      {step === 'phone' ? (
        <div key="phone" className="auth-step">
          <MobileNumberStep
            initialValue={phone}
            loading={sendingOtp}
            apiError={sendError}
            onSubmit={handleSendOtp}
          />
        </div>
      ) : (
        <div key="otp" className="auth-step">
          <OtpStep
            phone={phone}
            otpLength={otpLength}
            otp={otp}
            onOtpChange={setOtp}
            verifying={verifying}
            resending={resending}
            resendSeconds={resendSeconds}
            error={verifyError}
            onVerify={handleVerify}
            onResend={handleResend}
            onChangeNumber={handleChangeNumber}
          />
        </div>
      )}
    </div>
  )
}
