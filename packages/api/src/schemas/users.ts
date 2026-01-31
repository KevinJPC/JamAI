import { z } from 'zod'
import { objectIdSchema } from './shared.js'

const validateUserNameSchema = z.string().min(1).max(100).trim()
const validateUserLastNameSchema = z.string().min(1).max(100).trim()
const validateUserEmailSchema = z.string().email().trim().toLowerCase()
const validatePasswordSchema = z.string()
  .min(8)
  .max(32)
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter') // Lowercase character
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter') // Uppercase character
  .regex(/[0-9]/, 'Password must contain at least one number') // Number
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character') // Special character

export const signUpInputSchema = z.object({
  email: validateUserEmailSchema,
  name: validateUserNameSchema,
  lastName: validateUserLastNameSchema,
  password: validatePasswordSchema
})

export const updateUserInputSchema = z.object({
  userId: objectIdSchema,
  name: validateUserNameSchema,
  lastName: validateUserLastNameSchema,
})

export const signInInputSchema = z.object({
  email: z.string().trim().toLowerCase(),
  password: z.string()
})

export const userResponseSchema = z.object({
  id: objectIdSchema,
  name: z.string(),
  lastName: z.string(),
  email: z.string()
})

export const getAuthenticatedUserQuery = z.object({
  userId: objectIdSchema,
})
