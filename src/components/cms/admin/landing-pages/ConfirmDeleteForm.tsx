'use client'

import type { ReactNode } from 'react'

type ConfirmDeleteFormProps = {
  action: (formData: FormData) => void | Promise<void>
  id: string
  confirmMessage: string
  children: ReactNode
}

export default function ConfirmDeleteForm({ action, id, confirmMessage, children }: ConfirmDeleteFormProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      {children}
    </form>
  )
}
