import { z, ZodType } from 'zod'
import { ValidationError } from '../errors.js'

type RawOf<T> = { [K in keyof T]: unknown }

export function validateRequest<T extends ZodType> (schema: T, input: RawOf<z.input<T>>): z.output<T> {
  const validationResult = schema.safeParse(input)

  if (validationResult.success) return validationResult.data
  // TODO: remove
  console.log(validationResult.error)
  throw new ValidationError()
}
