import { Button } from '@/shared/components/Button'
import { Modal } from '@/shared/components/Modal'

import './Dialog.css'

export
function Dialog ({ onConfirm, onCancel, onExit, isOpen, setIsOpen, titleContent, messageContent }) {
  return (
    <Modal
      isOpen={isOpen}
      onIsOpenChange={setIsOpen}
      onExit={onExit}
    >
      <Modal.Backdrop />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            {titleContent}
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <p className='dialog__message'>
            {messageContent}
          </p>
          <div className='dialog__buttons-wrapper'>
            <Button
              className='dialog__buttons'
              variant='secondary'
              onClick={() => {
                onCancel()
                setIsOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              className='dialog__buttons'
              variant='primary'
              onClick={() => {
                onConfirm()
                setIsOpen(false)
              }}
            >
              Continue
            </Button>
          </div>

        </Modal.Body>

      </Modal.Content>
    </Modal>
  )
}
