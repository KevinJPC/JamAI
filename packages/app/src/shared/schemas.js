import { z } from 'zod'

export const objectIdFormatSchema = z.string().regex(/^[a-fA-F0-9]{24}$/)
