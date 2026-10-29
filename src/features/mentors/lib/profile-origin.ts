export const MENTOR_PROFILE_ORIGIN_PARAM = 'from'
export const MENTOR_PROFILE_ORIGIN_ALL_MENTORS = 'mentors'

export type ProfileOriginSearchParams = Record<string, string | string[] | undefined>

export function readProfileOrigin(params: ProfileOriginSearchParams) {
  const value = params[MENTOR_PROFILE_ORIGIN_PARAM]
  return (Array.isArray(value) ? value[0] : value) ?? null
}

export function buildReturnPath(
  pathname: string,
  params: ProfileOriginSearchParams,
  omittedParams: string[] = []
) {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (omittedParams.includes(key)) continue

    const values = Array.isArray(value) ? value : [value]
    for (const item of values) {
      if (item) search.append(key, item)
    }
  }

  const queryString = search.toString()
  return queryString ? `${pathname}?${queryString}` : pathname
}
