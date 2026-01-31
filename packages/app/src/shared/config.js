export const isDev = import.meta.env.DEV
export const backendUrl = isDev ? '' : import.meta.env.VITE_BACKEND_URL
