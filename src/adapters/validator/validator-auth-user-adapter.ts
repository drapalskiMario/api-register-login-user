import Validator from 'validatorjs'
import { AuthenticationUserParams } from '../../domain/use-cases/autentication'
import { AuthUserValidator } from '../../ports/validators/auth-user-validator'

export class ValidatorAuthUserAdapter implements AuthUserValidator {
  constructor () {}
  async validate (userParams: AuthenticationUserParams): Promise<boolean> {
    const validation = new Validator(userParams, { email: 'required|email', password: 'required|string' })
    if (validation.fails()) return true
    return false
  }
}
