import { NotFoundSignal } from '@/shared/errors'

// helper function to throw not found signal on react render which can later be catch to render a not found ui
export function notFound () {
  throw new NotFoundSignal()
}
