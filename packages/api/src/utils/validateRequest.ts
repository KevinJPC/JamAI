import { z, ZodType } from 'zod'
import { validationError, ValidationErrors } from '../errors.js'
import { flattenZodIssues } from '@chords-extractor/common/utils'

type RawOf<T> = { [K in keyof T]: unknown }

export function validateRequest<T extends ZodType> (schema: T, input: RawOf<z.input<T>>): z.output<T> {
  const validationResult = schema.safeParse(input)

  if (validationResult.success) return validationResult.data
  throw validationError({ errors: flattenZodIssues(validationResult.error.issues) as ValidationErrors })
}
