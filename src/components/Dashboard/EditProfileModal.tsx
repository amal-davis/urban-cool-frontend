import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from '../Modal/Modal'
import { CheckCircleIcon } from '../icons/Icons'
import { formatGroupedIndianMobile } from '../../lib/indianPhone'
import { isValidEmail } from '../../lib/validation'
import type { DashboardUser } from '../../data/dashboardData'
import './EditProfileModal.css'

interface EditProfileModalProps {
  open: boolean
  user: DashboardUser
  onClose: () => void
  /** Frontend-state-only save — see UserDashboard.tsx's handleSaveProfile
   *  for where this plugs into a real PUT /api/profile/ later. */
  onSave: (values: { fullName: string; email: string }) => void
}

/**
 * Frontend-only "Edit Profile" UI (task explicitly forbids a backend call
 * here yet). Full Name + Email only — the mobile number is shown read-only
 * with its verified mark; changing it belongs to the OTP re-verification
 * flow Login/Signup already own, not a plain text field here.
 */
export function EditProfileModal({ open, user, onClose, onSave }: EditProfileModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      {/* A genuinely separate component, mounted only while `open` — Modal
          itself already stops rendering `children` when closed (see its
          own `if (!open) return null`), so gating this too and giving it
          its own local state means every open is a fresh mount with the
          form reset to `user`'s current values for free. No reset effect
          needed (and no "setState in an effect" to avoid). */}
      {open && <EditProfileFormFields user={user} onClose={onClose} onSave={onSave} />}
    </Modal>
  )
}

interface EditProfileFormFieldsProps {
  user: DashboardUser
  onClose: () => void
  onSave: (values: { fullName: string; email: string }) => void
}

function EditProfileFormFields({ user, onClose, onSave }: EditProfileFormFieldsProps) {
  const [fullName, setFullName] = useState(user.fullName)
  const [email, setEmail] = useState(user.email)
  const [nameTouched, setNameTouched] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const trimmedName = fullName.trim()
  const trimmedEmail = email.trim()
  const isNameValid = trimmedName.length > 0
  const isEmailValid = isValidEmail(trimmedEmail)

  const nameError = nameTouched && !isNameValid ? 'Enter your full name.' : null
  const emailError = emailTouched && !isEmailValid ? 'Enter a valid email address.' : null

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNameTouched(true)
    setEmailTouched(true)
    if (!isNameValid) {
      nameRef.current?.focus()
      return
    }
    if (!isEmailValid) {
      emailRef.current?.focus()
      return
    }
    onSave({ fullName: trimmedName, email: trimmedEmail })
  }

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit} noValidate>
      <div className="edit-profile-form__phone">
        <span className="edit-profile-form__phone-label">Mobile Number</span>
        <span className="edit-profile-form__phone-value">
          +91 {formatGroupedIndianMobile(user.phone)}
          <CheckCircleIcon />
        </span>
        <span className="edit-profile-form__phone-hint">
          To change your mobile number, verify a new one from the sign-in screen.
        </span>
      </div>

      <div className={`form-field${nameError ? ' has-error' : ''}`}>
        <label htmlFor="edit-profile-name">Full Name</label>
        <input
          ref={nameRef}
          id="edit-profile-name"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          onBlur={() => setNameTouched(true)}
          aria-invalid={!!nameError}
          aria-describedby={nameError ? 'edit-profile-name-error' : undefined}
        />
        {nameError && (
          <span id="edit-profile-name-error" className="form-field__error" role="alert">
            {nameError}
          </span>
        )}
      </div>

      <div className={`form-field${emailError ? ' has-error' : ''}`}>
        <label htmlFor="edit-profile-email">Email Address</label>
        <input
          ref={emailRef}
          id="edit-profile-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => setEmailTouched(true)}
          aria-invalid={!!emailError}
          aria-describedby={emailError ? 'edit-profile-email-error' : undefined}
        />
        {emailError && (
          <span id="edit-profile-email-error" className="form-field__error" role="alert">
            {emailError}
          </span>
        )}
      </div>

      <div className="edit-profile-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={!isNameValid || !isEmailValid}>
          Save Changes
        </button>
      </div>
    </form>
  )
}
