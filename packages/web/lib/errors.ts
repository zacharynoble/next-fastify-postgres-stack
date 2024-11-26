import type { UseFormSetError } from 'react-hook-form'

interface FieldError {
    name: string
    message: string
}

interface ErrorResponse {
    status: number
    message: string
    detail?: string
    fields?: FieldError[]
}

export const parseError = (error: any): ErrorResponse => {
    const genericMessage = 'Sorry, something went wrong.'
    const genericStatus = 500

    try {
        const err = error.response.data.error
        return {
            message: err.message || genericMessage,
            status: err.status || genericStatus,
            fields: err.fields,
            detail: err.detail,
        }
    } catch {
        return {
            message: genericMessage,
            status: genericStatus,
        }
    }
}

export const setFieldErrors = (fields: FieldError[], setError: UseFormSetError<any>) => {
    fields.forEach(field => {
        setError(field.name, { message: field.message })
    })
}
