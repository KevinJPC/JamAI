import { inject } from 'regexparam'
import { z } from 'zod'

import { CHORDS_TABS_IDS } from '@/shared/constants'
import { ParamsValidationError, SearchParamsValidationError } from '@/shared/errors'
import { objectIdFormatSchema } from '@/shared/schemas'
import { filterObject } from '@/shared/utils/filterObject'

function createPath ({ path: pathTemplate, paramsSchema, searchSchema }) {
  // this function uses regexparam library https://github.com/lukeed/regexparam
  // to generate a string path based on the path string regex and the expected params
  // it also add search params passed if are not undefined
  // reguexparam is available since its used internally by wouter
  // see https://github.com/molefrog/wouter/issues/525#issuecomment-3563063797 or check the router dependencies

  const buildPathFromTemplate = ({ params, search: searchParams } = {}) => {
    const path = params ? inject(pathTemplate, params) : pathTemplate

    if (!searchParams) return path

    const nonUndefinedSearchParams = filterObject(searchParams, ([,value]) => value !== undefined)
    const urlSearchParams = new URLSearchParams(nonUndefinedSearchParams)
    if (urlSearchParams.size === 0) return path

    return path + `?${urlSearchParams.toString()}`
  }

  function paramsParserWrapper (params) {
    const result = paramsSchema.safeParse(params)
    if (!result.success) throw ParamsValidationError.fromZodError(result.error)
    return result.data
  }

  function searchParamsParserWrapper (searchParams) {
    const result = searchSchema.safeParse(searchParams)
    if (!result.success) throw SearchParamsValidationError.fromZodError(result.error)
    return result.data
  }

  return {
    path: pathTemplate,
    build: buildPathFromTemplate,
    paramsParser: paramsSchema ? paramsParserWrapper : undefined,
    searchParser: searchSchema ? searchParamsParserWrapper : undefined
  }
}

export const paths = {
  home: createPath({
    path: '/'
  }),
  search: createPath({
    path: '/search',
    searchSchema: z.object({ q: z.string().optional() })
  }),
  chords: createPath({
    path: '/chords/:songId',
    paramsSchema: z.object({ songId: objectIdFormatSchema }),
    searchSchema: z.object({
      version: objectIdFormatSchema.catch(),
      view: z.enum([CHORDS_TABS_IDS.edit, CHORDS_TABS_IDS.general]).catch()
    })
  }),
  me: {
    ...createPath({ path: '/me' }),
    favorites: createPath({ path: '/me/favorites' }),
    versions: createPath({
      path: '/me/versions'
    })
  },
}
