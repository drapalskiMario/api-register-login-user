import { Encrypter } from '../../interface-adapters/cryptography/encrypter'
import { HashComparer } from '../../interface-adapters/cryptography/hash-comparer'
import { LoadUserByEmailRepository } from '../../interface-adapters/repositories/load-by-email'
import { SaveUserTokenRepository } from '../../interface-adapters/repositories/save-user-token'

export class Authentication {
  constructor (
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly saveUserTokenRepository: SaveUserTokenRepository
  ) { }

  async auth (email: string, password: string): Promise<string> {
    const user = await this.loadUserByEmailRepository.loadByEmail(email)
    if (user) {
      const isValid = await this.hashComparer.compare(password, user.password)
      if (isValid) {
        const token = await this.encrypter.encrypt(user.id)
        await this.saveUserTokenRepository.saveUserToken(user.id, token)
        return token
      }
    }
    return null
  }
}
