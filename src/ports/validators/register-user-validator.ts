import { RegisterUserParams } from '../../domain/use-cases/register-user'

export interface RegisterUserValidator {
  validate (userParams: RegisterUserParams): Promise <boolean>
}
