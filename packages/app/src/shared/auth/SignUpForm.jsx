import { Link } from 'wouter'

import { useSignUpMutation } from '@/shared/auth/queries'
import { Button } from '@/shared/components/Button'
import { Spinner } from '@/shared/components/Spinner'
import { TextInput } from '@/shared/components/TextInput'

import './SignUpForm.css'

export const SignUpForm = ({ goToLogIn, onSuccess }) => {
  const signUp = useSignUpMutation()

  const handleOnSubmit = (e) => {
    e.preventDefault()
    const { email, password, name, lastName } = Object.fromEntries(new FormData(e.currentTarget))
    signUp.mutate({ email, password, name, lastName }, {
      onSuccess: () => {
        onSuccess?.()
      }
    })
  }

  return (
    <form
      className='sign-up-form'
      onSubmit={handleOnSubmit}
    >
      <TextInput type='name' name='name' placeholder='Name' />
      <TextInput type='lastName' name='lastName' placeholder='Lat name' />
      <TextInput type='email' name='email' placeholder='Email' />
      <TextInput type='password' name='password' placeholder='Password' />
      <div className='sign-up-form__buttons'>

        {
        typeof goToLogIn === 'string'
          ? <Link to={goToLogIn}>Log in</Link>
          : (
            <Button
              className='sign-up-form__button'
              variant='secondary'
              type='button'
              onClick={() => goToLogIn?.()}
            >Log in
            </Button>
            )
      }
        <Button
          disabled={signUp.isPending}
          className='sign-up-form__button'
          variant='primary'
          type='submit'
        >
          {signUp.isPending ? <Spinner width={22} /> : 'Sign up'}
        </Button>
      </div>

      {/* <span>{mutation.error?.errorCode}</span> */}
    </form>
  )
}
