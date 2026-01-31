import { z } from 'zod'
import { tryObjectIdFromStringOrNull } from '../utils/tryObjectIdFromStringOrNull.js'
import { ObjectId } from 'mongodb'

export const beatChordSchema = z.object({
  time: z.number(),
  number: z.number(),
  chord: z.string().nullable()
})

export const keyModeSchema = z.union([z.literal('minor'), z.literal('major')])
export const pitchClassSchema = z.number().min(0).max(11)

export const keySchema = z.object({
  mode: keyModeSchema,
  pitchClass: pitchClassSchema
})

export const continuationTokenSchema = z.coerce.string().optional()

export const objectIdSchema = z.union([z.string(), z.instanceof(ObjectId)]).transform((v, ctx) => {
  if (v instanceof ObjectId) return v
  const parsedValue = tryObjectIdFromStringOrNull(v)
  if (parsedValue) return parsedValue

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'Not a valid ObjectId'
  })
  return z.NEVER
})
