import { z } from 'zod'

import { getItemFromLocalStorage, setItemToLocalStorage } from '@/shared/utils/localStorage'

const isLoggedInValidator = z.boolean().catch(_ => false)

const IS_LOGGED_IN_STORAGE_KEY = 'isLoggedIn'
export const getPersistedIsLoggedIn = () => isLoggedInValidator.parse(getItemFromLocalStorage(IS_LOGGED_IN_STORAGE_KEY))
export const updatePersistedIsLoggedIn = (value) => setItemToLocalStorage(IS_LOGGED_IN_STORAGE_KEY, value)
