declare module 'express-session' {
  interface SessionData {
    user: { id: string }
  }
}

export {}
