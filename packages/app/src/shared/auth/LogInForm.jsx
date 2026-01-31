import { useSignInMutation } from '@/shared/auth/queries'
import { Button } from '@/shared/components/Button'
import { Spinner } from '@/shared/components/Spinner'
import { TextInput } from '@/shared/components/TextInput'

import './LogInForm.css'

export const LogInForm = ({ goToSignUp, onSuccess, onPending, onError }) => {
  const signInMutation = useSignInMutation()
  const handleOnSubmit = (e) => {
    e.preventDefault()
    const { email, password } = Object.fromEntries(new FormData(e.currentTarget))
    onPending?.()
    signInMutation.mutate({ email, password }, {
      onSuccess: () => {
        onSuccess?.()
      },
      onError: () => {
        onError?.()
      }
    })
  }

  // Prevent duplicate actions during login and avoid button text flashing after a successful login,
  // particularly when the form is in a modal with an exit animation
  const isButtonDisabled = signInMutation.status === 'pending' || signInMutation.status === 'success'

  return (
    <form onSubmit={handleOnSubmit} className='log-in__form'>
      <TextInput type='email' name='email' placeholder='email' />
      <TextInput type='password' name='password' placeholder='password' />

      {signInMutation.status === 'error' ? <span>{signInMutation.error?.errorCode}</span> : null}

      <div className='log-in__buttons'>
        {
        typeof goToSignUp === 'string'
          ? <Button variant='secondary' as='link' to={goToSignUp} className='log-in__button'>Sign up</Button>
          : <Button variant='secondary' type='button' onClick={() => goToSignUp?.()} className='log-in__button'>Sign up</Button>
        }
        <Button variant='primary' type='submit' disabled={isButtonDisabled} className='log-in__button'>
          {isButtonDisabled ? <Spinner size={16} /> : 'Log in'}
        </Button>
      </div>
    </form>
  )
}
