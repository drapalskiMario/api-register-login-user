import { Error } from '../domain/use-cases/errors'

export const invalidParamsError = (): Error => {
  return { error: 'invalid params' }
}

export const userExistsError = (): Error => {
  return { error: 'user already exists' }
}
