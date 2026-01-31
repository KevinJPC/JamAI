import { Link } from '@/shared/components/Link'

export const ConditionalLink = ({ children, isNavigable, ...props }) => {
  return (
    <>
      {(isNavigable)
        ? (
          <Link {...props}>
            {children}
          </Link>
          )
        : children}
    </>
  )
}
