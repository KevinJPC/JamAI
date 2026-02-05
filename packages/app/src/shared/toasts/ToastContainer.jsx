import { cssTransition, ToastContainer as ReactToastifyToastContainer } from 'react-toastify'

import { GENERAL_CONTAINER_ID } from '@/shared/toasts/constants'

import './ToastContainer.css'

const Transition = cssTransition({
  enter: 'toast__slide-in',
  exit: 'toast__slide-out',
  appendPosition: true,
  collapse: false
})

export const ToastContainer = () => {
  return (
    <ReactToastifyToastContainer
      draggable='touch'
      limit={3}
      containerId={GENERAL_CONTAINER_ID}
      position='bottom-right'
      theme='dark'
      transition={(props) => {
        /*
        ** When a toast is swiped, `preventExitTransition` is set to true in the props.
        ** So `preventExitTransition` is set to `false` to ensure the exit animation always plays when a toast is removed.
        ** And to apply a unique animation class for swiped toasts, the position is adjusted by appending '-swipe'.
        ** Otherwise, the default position class is used.
        */
        const position = props.preventExitTransition ? `${props.position}-swipe` : props.position
        return <Transition {...props} preventExitTransition={false} position={position} />
      }}
      draggablePercent={30}
    />
  )
}
