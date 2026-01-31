import { CustomSkeleton } from './CustomSkeleton.jsx'

import './UserAvatar.css'

export function UserAvatarSkeleton () {
  return (
    <CustomSkeleton fullHeightContainer borderRadius='999px' width='100%' height='100%' flex style={{ aspectRatio: '1/1' }} />
  )
}

export const UserAvatar = ({ name, lastName }) => {
  const fullNameInitials = [name?.at(0) ?? '', lastName?.at(0) ?? ''].join('').toUpperCase()
  return (
    <div
      className='user-avatar'
    >
      {fullNameInitials}
    </div>
  )
}
