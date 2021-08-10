import { User } from '../../domain/entities/user'
import { Error } from '../../domain/use-cases/errors'
import { RegisterUser, RegisterUserParams } from '../../domain/use-cases/register-user'
import { Hasher } from '../../ports/cryptography/hasher'
import { LoadUserByEmailRepository } from '../../ports/repositories/load-by-email'
import { RegisterUserRepository } from '../../ports/repositories/register'
import { RegisterUserValidator } from '../../ports/validators/register-user-validator'
import { invalidParamsError, userExistsError } from '../errors'

export class RegisterUserUseCase implements RegisterUser {
  constructor (
    private readonly registerUserValidator: RegisterUserValidator,
    private readonly loadUserEmailRepository: LoadUserByEmailRepository,
    private readonly hasher: Hasher,
    private readonly registerUserRepository: RegisterUserRepository
  ) { }

  async register (registerUserParams: RegisterUserParams): Promise<User | Error> {
    const errors = await this.registerUserValidator.validate(registerUserParams)
    if (!errors) {
      delete registerUserParams.passwordConfirmation
      const userExists = await this.loadUserEmailRepository.loadByEmail(registerUserParams.email)
      if (!userExists) {
        const hashedPassword = await this.hasher.hash(registerUserParams.password)
        registerUserParams.password = hashedPassword
        const resultUser = await this.registerUserRepository.register(registerUserParams)
        return resultUser
      }
      return userExistsError()
    }
    return invalidParamsError()
  }
}
