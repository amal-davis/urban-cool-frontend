import { useState } from 'react'
import type { FormEvent } from 'react'
import { MapPinIcon, PencilIcon, PlusIcon, TrashIcon } from '../../icons/Icons'
import { Modal } from '../../Modal/Modal'
import type { Address } from '../../../data/dashboardData'
import './AddressSection.css'
import './SectionCard.css'

interface AddressSectionProps {
  addresses: Address[]
  onAdd: (values: Omit<Address, 'id' | 'isDefault'>) => void
  onUpdate: (id: string, values: Omit<Address, 'id' | 'isDefault'>) => void
  onDelete: (id: string) => void
}

type FormValues = Omit<Address, 'id' | 'isDefault'>

const blankForm: FormValues = {
  label: '',
  recipientName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
}

/** My Address. Add/Edit share one form (in a Modal); Delete confirms
 *  inline on the card itself rather than a native confirm() dialog, so the
 *  whole interaction stays inside this design system. All three are local
 *  React state only (props callbacks own the actual add/update/delete —
 *  see UserDashboard.tsx) — no backend call, per the frontend-only brief. */
export function AddressSection({ addresses, onAdd, onUpdate, onDelete }: AddressSectionProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [values, setValues] = useState<FormValues>(blankForm)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  function openAddForm() {
    setEditingId(null)
    setValues(blankForm)
    setFormOpen(true)
  }

  function openEditForm(address: Address) {
    setEditingId(address.id)
    setValues({
      label: address.label,
      recipientName: address.recipientName,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    })
    setFormOpen(true)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed: FormValues = {
      label: values.label.trim() || 'Address',
      recipientName: values.recipientName.trim(),
      line1: values.line1.trim(),
      line2: values.line2?.trim() || undefined,
      city: values.city.trim(),
      state: values.state.trim(),
      postalCode: values.postalCode.trim(),
      country: values.country.trim() || 'India',
    }
    if (!trimmed.recipientName || !trimmed.line1 || !trimmed.city || !trimmed.state || !trimmed.postalCode) return

    if (editingId) {
      onUpdate(editingId, trimmed)
    } else {
      onAdd(trimmed)
    }
    setFormOpen(false)
  }

  return (
    <>
      {addresses.length === 0 ? (
        <div className="section-card">
          <div className="section-empty">
            <MapPinIcon />
            <p className="section-text">No saved addresses yet.</p>
            <button type="button" className="btn btn--primary" onClick={openAddForm}>
              <PlusIcon /> Add Address
            </button>
          </div>
        </div>
      ) : (
        <>
          {addresses.map((address) => (
            <div key={address.id} className="section-card address-card">
              <div className="address-card__header">
                <span className="address-card__label">{address.label}</span>
                {address.isDefault && <span className="address-card__default">Default</span>}
              </div>
              <p className="address-card__name">{address.recipientName}</p>
              <p className="address-card__lines">
                {address.line1}
                {address.line2 && <>, {address.line2}</>}
                <br />
                {address.city}, {address.state} - {address.postalCode}
                <br />
                {address.country}
              </p>

              {confirmDeleteId === address.id ? (
                <div className="address-card__confirm">
                  <span>Delete this address?</span>
                  <div className="address-card__confirm-actions">
                    <button type="button" className="btn btn--ghost" onClick={() => setConfirmDeleteId(null)}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn--accent"
                      onClick={() => {
                        onDelete(address.id)
                        setConfirmDeleteId(null)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="address-card__actions">
                  <button type="button" className="btn btn--ghost" onClick={() => openEditForm(address)}>
                    <PencilIcon /> Edit
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={() => setConfirmDeleteId(address.id)}>
                    <TrashIcon /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          <button type="button" className="btn btn--ghost address-section__add" onClick={openAddForm}>
            <PlusIcon /> Add Address
          </button>
        </>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editingId ? 'Edit Address' : 'Add Address'}>
        <AddressFormFields values={values} onChange={setValues} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
      </Modal>
    </>
  )
}

interface AddressFormFieldsProps {
  values: FormValues
  onChange: (values: FormValues) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

function AddressFormFields({ values, onChange, onSubmit, onCancel }: AddressFormFieldsProps) {
  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    onChange({ ...values, [key]: value })
  }

  return (
    <form className="address-form" onSubmit={onSubmit} noValidate>
      <div className="address-form__row address-form__row--single">
        <div className="form-field">
          <label htmlFor="address-label">Label</label>
          <input id="address-label" value={values.label} onChange={(e) => set('label', e.target.value)} placeholder="Home" />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="address-name">Recipient Name</label>
        <input
          id="address-name"
          required
          value={values.recipientName}
          onChange={(e) => set('recipientName', e.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="address-line1">House / Street</label>
        <input id="address-line1" required value={values.line1} onChange={(e) => set('line1', e.target.value)} />
      </div>

      <div className="form-field">
        <label htmlFor="address-line2">Landmark / Area (optional)</label>
        <input id="address-line2" value={values.line2 ?? ''} onChange={(e) => set('line2', e.target.value)} />
      </div>

      <div className="address-form__row">
        <div className="form-field">
          <label htmlFor="address-city">City</label>
          <input id="address-city" required value={values.city} onChange={(e) => set('city', e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="address-state">State</label>
          <input id="address-state" required value={values.state} onChange={(e) => set('state', e.target.value)} />
        </div>
      </div>

      <div className="address-form__row">
        <div className="form-field">
          <label htmlFor="address-postal">Postal Code</label>
          <input
            id="address-postal"
            required
            inputMode="numeric"
            value={values.postalCode}
            onChange={(e) => set('postalCode', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="address-country">Country</label>
          <input id="address-country" value={values.country} onChange={(e) => set('country', e.target.value)} />
        </div>
      </div>

      <div className="address-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          Save Address
        </button>
      </div>
    </form>
  )
}
