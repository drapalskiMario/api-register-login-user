import { AuthenticationUserParams } from '../../domain/use-cases/autentication'

export interface AuthUserValidator {
  validate (userParams: AuthenticationUserParams): Promise <boolean>
}
