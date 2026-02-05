import { Link } from 'wouter'

import { useSignUpMutation } from '@/shared/auth/queries'
import { Alert, alertType } from '@/shared/components/Alert'
import { Button } from '@/shared/components/Button'
import { Spinner } from '@/shared/components/Spinner'
import { TextInput } from '@/shared/components/TextInput'
import { getApiValidationErrorMessages } from '@/shared/utils/getApiValidationErrorMessages'

import './SignUpForm.css'

export const SignUpForm = ({ goToLogIn, onSuccess }) => {
  const signUpMutation = useSignUpMutation()

  const handleOnSubmit = (e) => {
    e.preventDefault()
    const { email, password, name, lastName } = Object.fromEntries(new FormData(e.currentTarget))
    signUpMutation.mutate({ email, password, name, lastName }, {
      onSuccess: () => {
        onSuccess?.()
      }
    })
  }

  const isButtonDisabled = signUpMutation.isPending || signUpMutation.isSuccess

  return (
    <form
      className='sign-up-form'
      onSubmit={handleOnSubmit}
    >
      <TextInput
        type='text' name='name' placeholder='Name'
        errorMessages={getApiValidationErrorMessages(signUpMutation.error, 'name')}
      />
      <TextInput
        type='text' name='lastName' placeholder='Last name'
        errorMessages={getApiValidationErrorMessages(signUpMutation.error, 'lastName')}
      />
      <TextInput
        type='email' name='email' placeholder='Email'
        errorMessages={getApiValidationErrorMessages(signUpMutation.error, 'email')}
      />
      <TextInput
        type='password' name='password' placeholder='Password'
        errorMessages={getApiValidationErrorMessages(signUpMutation.error, 'password')}
      />

      {signUpMutation.error?.message && <Alert type={alertType.error} title={signUpMutation.error.message} />}

      <div className='sign-up-form__buttons'>
        {typeof goToLogIn === 'string'
          ? <Link to={goToLogIn}>Log in</Link>
          : (
            <Button
              className='sign-up-form__button'
              variant='secondary'
              type='button'
              onClick={() => goToLogIn?.()}
            >Log in
            </Button>
            )}

        <Button
          disabled={isButtonDisabled}
          className='sign-up-form__button'
          variant='primary'
          type='submit'
        >
          {isButtonDisabled ? <Spinner width={22} /> : 'Sign up'}
        </Button>
      </div>

    </form>
  )
}
