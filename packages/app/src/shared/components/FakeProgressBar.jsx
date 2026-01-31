import { useEffect, useState } from 'react'
import classNames from 'classnames'

import './FakeProgressBar.css'

const FAKE_BAR_TRANSITION_TIME = 1000
const UPDATE_TIME = 2000

export const FakeProgressBar = ({ hasFinished = false, className = '', onCompletedTransitionEnd }) => {
  const [fakeProgress, setFakeProgress] = useState(() => 0)

  useEffect(() => {
    if (fakeProgress <= 100 && hasFinished) {
      /* wrap the change of state in the requestAnimationFrame function to ensure that the animation is shown
      ** this is because if the state change is executed right after the component is render it may not show
      ** the css animation correctly
      */
      window.requestAnimationFrame(() => {
        setFakeProgress(100)
      })
      return
    }
    if (fakeProgress >= 90) return
    const timeoutId = setTimeout(() => {
      const stepValueRandom = Math.floor(Math.random() * 10) + 1
      const newProgress = fakeProgress + stepValueRandom
      setFakeProgress(newProgress)
    }, UPDATE_TIME)

    return () => clearTimeout(timeoutId)
  }, [fakeProgress, hasFinished])

  return (

    <div className={classNames('progress-bar', className)}>
      <div
        className='progress-bar__value-background'
        style={{ width: `${fakeProgress}%`, '--update-transition-time': `${FAKE_BAR_TRANSITION_TIME}ms` }}
        onTransitionEnd={(e) => {
          if (!hasFinished && e.propertyName === 'width') return
          onCompletedTransitionEnd()
        }}
      />
    </div>
  )
}
