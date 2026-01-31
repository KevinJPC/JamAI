import { BULLET_POINT } from '@/shared/constants'

export const joinWithBulletPoint = (itemsText) => {
  return itemsText.join(` ${BULLET_POINT} `)
}
