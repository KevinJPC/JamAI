import { delay } from '@/shared/utils/delay'

export async function randomThrow () {
  const shouldThrow = Math.round(Math.random())
  console.log('shouldThrow', shouldThrow)

  await delay(1000)

  if (shouldThrow) throw new Error('Random error')
}
