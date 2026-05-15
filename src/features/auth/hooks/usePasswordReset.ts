import { useMutation } from '@tanstack/react-query'
import {
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from '../api/auth.api'
import {
  ForgotPasswordPayload,
  VerifyResetCodePayload,
  ResetPasswordPayload,
} from '../types/auth.types'

export function usePasswordReset() {
  const requestCodeMutation = useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
  })

  const verifyCodeMutation = useMutation({
    mutationFn: (payload: VerifyResetCodePayload) => verifyResetCode(payload),
  })

  const resetPasswordMutation = useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
  })

  return { requestCodeMutation, verifyCodeMutation, resetPasswordMutation }
}
