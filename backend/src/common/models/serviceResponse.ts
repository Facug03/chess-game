import { z } from 'zod'

export const RESPONSE_STATUS = {
  SUCCESS: 1,
  FAILED: 0,
} as const

export class ServiceResponse<T = null> {
  success: boolean
  message: string
  responseObject: T
  statusCode: number

  constructor(
    status: (typeof RESPONSE_STATUS)[keyof typeof RESPONSE_STATUS],
    message: string,
    responseObject: T,
    statusCode: number
  ) {
    this.success = status === RESPONSE_STATUS.SUCCESS
    this.message = message
    this.responseObject = responseObject
    this.statusCode = statusCode
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    responseObject: dataSchema.optional(),
    statusCode: z.number(),
  })
