import { z } from 'zod'
import { getAuthenticatedUserQuery, signInInputSchema, signUpInputSchema, updateUserInputSchema, userResponseSchema } from '../schemas/users.js'

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>
export type SignInInput = z.infer<typeof signInInputSchema>
export type SignUpInput = z.infer<typeof signUpInputSchema>
export type UserResponse = z.infer<typeof userResponseSchema>
export type GetAuthenticatedUserQuery = z.infer<typeof getAuthenticatedUserQuery>
