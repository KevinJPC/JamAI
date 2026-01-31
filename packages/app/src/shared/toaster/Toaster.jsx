import { useEffect } from 'react'
import { cssTransition, toast, ToastContainer, useToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import './Toaster.css'

const Transition = cssTransition({
  enter: 'toast__slide-in',
  exit: 'toast__slide-out',
  appendPosition: true,
  collapse: false
})

const TOAST_LIMIT = 3

export const Toaster = () => {
  // Limit showed toast to 3 as max
  const toastContainer = useToastContainer({ containerId: 'general' })
  useEffect(() => {
    toastContainer.getToastToRender((_position, toasts) => {
      toasts
        .reverse()
        .filter((_t, index) => index + 1 > TOAST_LIMIT)
        .forEach(t => {
          if (t.props.toastId) {
            toast.dismiss(t.props.toastId)
          }
        })
    })
  }, [toastContainer.count])
  return (
    <ToastContainer
      containerId='general'
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
