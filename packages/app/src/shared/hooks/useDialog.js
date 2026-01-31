import { useState } from 'react'

// Based on: https://www.esveo.com/en/blog/O5/
export const useDialog = () => {
  const [node, setNode] = useState(null)

  const updateNode = (componentCreatorFn) => {
    return new Promise((resolve, _reject) => {
      let promiseIsPending = true

      // The `close` function is defined separately to allow modals or components with an exit animation
      // to complete the animation before the modal is unmounted.
      // If the promise has not been resolved yet, it will resolve with `undefined` when `close` is called.
      const close = () => {
        setNode(null)
        if (promiseIsPending) resolve()
      }

      const answer = (value) => {
        resolve(value)
        promiseIsPending = false
      }

      setNode(componentCreatorFn({ answer, close }))
    })
  }

  return [node, updateNode]
}
