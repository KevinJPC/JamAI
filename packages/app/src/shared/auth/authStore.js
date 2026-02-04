import { z } from 'zod'

import { getItemFromLocalStorage, setItemToLocalStorage } from '@/shared/utils/localStorage'

const isLoggedInValidator = z.boolean().catch(_ => false)
const sessionExpired = z.boolean().catch(_ => false)

const IS_LOGGED_IN_STORAGE_KEY = 'isLoggedIn'

export const getPersistedIsLoggedIn = () => isLoggedInValidator.parse(getItemFromLocalStorage(IS_LOGGED_IN_STORAGE_KEY))
export const updatePersistedIsLoggedIn = (value) => setItemToLocalStorage(IS_LOGGED_IN_STORAGE_KEY, value)

const SESSION_EXPIRED_STORAGE_KEY = 'sessionExpired'

export const getPersistedSessionExpired = () => sessionExpired.parse(getItemFromLocalStorage(SESSION_EXPIRED_STORAGE_KEY))
export const updatePersistedSessionExpired = (value) => setItemToLocalStorage(SESSION_EXPIRED_STORAGE_KEY, value)
