import { backendUrl } from '@/shared/config'
import { ApiFetcher } from '@/shared/utils/ApiFetcher'

export const apiClient = new ApiFetcher(backendUrl)
