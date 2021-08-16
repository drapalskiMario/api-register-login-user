import { AuthenticationUser, AuthenticationUserParams, AuthenticationUserResponse } from '../../domain/use-cases/autentication'
import { AuthUserValidator } from '../../ports/validators/auth-user-validator'
import { Encrypter } from '../../ports/cryptography/encrypter'
import { HashComparer } from '../../ports/cryptography/hash-comparer'
import { LoadUserByEmailRepository } from '../../ports/repositories/load-by-email'
import { SaveUserTokenRepository } from '../../ports/repositories/save-user-token'
import { invalidParamsError } from '../errors'

export class AuthenticationUserUseCase implements AuthenticationUser {
  constructor (
    private readonly authUserValidator: AuthUserValidator,
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly saveUserTokenRepository: SaveUserTokenRepository
  ) { }

  async auth (authenticationUserParams: AuthenticationUserParams): Promise<AuthenticationUserResponse> {
    const errors = await this.authUserValidator.validate(authenticationUserParams)
    if (!errors) {
      const user = await this.loadUserByEmailRepository.loadByEmail(authenticationUserParams.email)
      if (user) {
        const isValid = await this.hashComparer.compare(authenticationUserParams.password, user.password)
        if (isValid) {
          const tokenResult = await this.encrypter.encrypt(user.id)
          await this.saveUserTokenRepository.saveUserToken(user.id, tokenResult)
          return { error: null, success: tokenResult }
        }
      }
    }
    return { error: invalidParamsError(), success: null }
  }
}
