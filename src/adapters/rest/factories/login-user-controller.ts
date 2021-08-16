import { AuthenticationUserUseCase } from '../../../application/authentication/authentication'
import { BcrypterAdapter } from '../../criptography/bcrypt-adapter/bcrypter-adapter'
import { JwtAdapter } from '../../criptography/jwt-adapter/jwt-adapter'
import { PgUserRepository } from '../../database/repositories/pg-user-repository'
import { ValidatorAuthUserAdapter } from '../../validator/validator-auth-user-adapter'
import { Controller } from '../type-adapter/controller-adapter'
import { LoginUserController } from '../controllers/login-user-controller'

export const makeLoginUserController = (): Controller => {
  const salt = 12
  const authenticationValidatior = new ValidatorAuthUserAdapter()
  const userRepository = new PgUserRepository()
  const hashComparer = new BcrypterAdapter(salt)
  const encrypter = new JwtAdapter(process.env.SECRET)
  const authenticationUser = new AuthenticationUserUseCase(authenticationValidatior, userRepository, hashComparer, encrypter, userRepository)
  return new LoginUserController(authenticationUser)
}
