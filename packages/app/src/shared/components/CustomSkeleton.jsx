import Skeleton from 'react-loading-skeleton'
import classNames from 'classnames'

import 'react-loading-skeleton/dist/skeleton.css'
import './CustomSkeleton.css'

export const CustomSkeleton = ({
  children,
  maxWidth,
  maxHeight,
  flexContainer = false,
  fullWidthContainer = false,
  fullHeightContainer = false,
  className,
  containerClassName,
  style,
  brighter = false,
  isContainer = false,
  ...props
}) => {
  if (isContainer) {
    return (
      <div
        {...props}
        style={{ ...style, maxHeight, maxWidth, width: props.width, height: props.height, padding: props.padding }}
        className={classNames('custom-skeleton-container-box', className)}
      >
        {children}
      </div>
    )
  }
  return (
    <Skeleton
      className={classNames('custom-skeleton', className, {
        'custom-skeleton--brighter': brighter
      })}
      containerClassName={classNames('custom-skeleton-container', containerClassName, {
        'custom-skeleton-container--flex': flexContainer,
        'custom-skeleton-container--full-w': fullWidthContainer,
        'custom-skeleton-container--full-h': fullHeightContainer
      })}
      {...props}
      style={{ ...style, maxWidth, maxHeight }}
    />
  )
}
