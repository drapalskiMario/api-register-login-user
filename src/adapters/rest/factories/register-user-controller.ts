import { RegisterUserUseCase } from '../../../application/register-user/register-user'
import { BcrypterAdapter } from '../../criptography/bcrypt-adapter/bcrypter-adapter'
import { PgUserRepository } from '../../database/repositories/pg-user-repository'
import { ValidatorRegisterUserAdapter } from '../../validator/validator-register-user-adapter'
import { Controller } from '../type-adapter/controller-adapter'
import { RegisterUserController } from '../controllers/register-user-controller'

export const makeRegisterUserController = (): Controller => {
  const salt = 12
  const registerValidator = new ValidatorRegisterUserAdapter()
  const userRepository = new PgUserRepository()
  const hasher = new BcrypterAdapter(salt)
  const registerUser = new RegisterUserUseCase(registerValidator, userRepository, hasher, userRepository)
  return new RegisterUserController(registerUser)
}
