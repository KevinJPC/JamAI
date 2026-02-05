import { toast } from 'react-toastify'
import classNames from 'classnames'

import { useAuth } from '@/shared/auth/AuthContext'
import { Button } from '@/shared/components/Button'
import { Spinner } from '@/shared/components/Spinner'
import { TextInput } from '@/shared/components/TextInput'
import { useUpdateUserMutation } from '@/shared/queries/userQueries'
import { GENERAL_CONTAINER_ID } from '@/shared/toasts/constants'

import './UserAccountSettingsForm.css'

export function UserAccountSettingsForm ({ className }) {
  const auth = useAuth()

  const updateUserMutation = useUpdateUserMutation()

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const { name, lastName } = Object.fromEntries(formData)
    updateUserMutation.mutate({ name, lastName }, {
      onSuccess: () => {
        toast.success('Account updated', { containerId: GENERAL_CONTAINER_ID })
      },
      onError: () => {
        toast.error('Error updating account', { containerId: GENERAL_CONTAINER_ID })
      }
    })
  }
  return (
    <form className={classNames('user-account-settings-form', className)} onSubmit={handleSubmit}>
      <TextInput label='Name:' defaultValue={auth.user.name} type='text' placeholder='Name' name='name' id='name' />
      <TextInput label='Last name:' defaultValue={auth.user.lastName} type='text' placeholder='Last name' name='lastName' id='lastName' />
      <TextInput label='Email:' defaultValue={auth.user.email} type='text' placeholder='Email' name='email' id='email' disabled />

      <Button
        disabled={updateUserMutation.isPending}
        className='user-account-settings-form__button'
        variant='primary'
        type='submit'
      >
        {updateUserMutation.isPending ? <Spinner size={18} /> : 'Save'}
      </Button>
    </form>
  )
}
