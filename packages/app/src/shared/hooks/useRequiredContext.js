import { useContext } from 'react'

export const useRequiredContext = (Context, errorMessage) => {
  const context = useContext(Context)
  if (context === undefined) throw new Error(errorMessage ?? 'Context must be used in a component within <Context.Provider> component.')
  return context
}
