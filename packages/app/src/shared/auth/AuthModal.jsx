import { useState } from 'react'

import { LogInForm } from '@/shared/auth/LogInForm'
import { SignUpForm } from '@/shared/auth/SignUpForm'
import { Modal } from '@/shared/components/Modal'

const FORM_VIEWS = {
  login: 'login',
  signup: 'signup'
}

export function AuthModal ({ initialFormView: initialFormViewProp, onClose, onSuccess }) {
  const [isOpen, setIsOpen] = useState(true)
  const initialFormView = FORM_VIEWS[initialFormViewProp] ?? FORM_VIEWS.login
  const [formView, setCurrentFormView] = useState(initialFormView)

  const handleLoginSucess = () => {
    onSuccess?.()
    setIsOpen(false)
  }

  const handleSignUpSucess = () => {
    setCurrentFormView(FORM_VIEWS.login)
  }

  return (
    <Modal
      isOpen={isOpen}
      onIsOpenChange={setIsOpen}
      onExit={onClose}
    >
      <Modal.Backdrop />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            {formView === FORM_VIEWS.login ? 'Log in into your account ' : 'Create an account'}
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          {formView === FORM_VIEWS.login
            ? <LogInForm
                goToSignUp={() => setCurrentFormView(FORM_VIEWS.signup)}
                onSuccess={handleLoginSucess}
              />
            : <SignUpForm
                goToLogIn={() => setCurrentFormView(FORM_VIEWS.login)}
                onSuccess={handleSignUpSucess}
              />}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}
