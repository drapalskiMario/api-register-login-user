import Validator from 'validatorjs'
import { RegisterUserParams } from '../../domain/use-cases/register-user'
import { RegisterUserValidator } from '../../ports/validators/register-user-validator'

export class ValidatorRegisterUserAdapter implements RegisterUserValidator {
  constructor () {}
  async validate (userParams: RegisterUserParams): Promise<boolean> {
    const validation = new Validator(userParams, {
      name: 'required|string',
      email: 'required|email',
      password: 'required|string',
      passwordConfirmation: 'required|same:password'
    })
    if (validation.fails()) return true
    return false
  }
}
