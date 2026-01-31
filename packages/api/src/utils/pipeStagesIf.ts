import { Document } from 'mongodb'

export function pipeStagesIf (condition: unknown, ...stages: Document[]) {
  return (condition ? [...stages] : [])
}
