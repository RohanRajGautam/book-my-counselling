import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateMe } from '../api/users.api'
import type { UserUpdatePayload } from '../types/users.types'

/**
 * Updates the signed-in user's own account.
 *
 * This is the generic account-settings write path (`PATCH /users/me`), for
 * any role. The mentor profile form does NOT use it — a mentor's contact
 * number is saved in the same request as the rest of the profile, via
 * `PUT /mentors/profile/me`.
 *
 * On success the `['auth', 'me']` cache is overwritten with the returned
 * user. `useCurrentUser` treats that entry as fresh for 5 minutes and
 * doesn't refetch on window focus, so without this the new phone (and any
 * other changed field) would not show up until a hard reload.
 */
export function useUpdateMe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UserUpdatePayload) => updateMe(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'me'], user)
    },
  })
}
