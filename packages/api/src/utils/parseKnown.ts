import { z } from 'zod'

export function parseKnown<T extends z.ZodType> (schema: T, input: z.input<T>): z.output<T> {
  return schema.parse(input)
}
