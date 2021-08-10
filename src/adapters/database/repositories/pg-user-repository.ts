import { getRepository } from 'typeorm'
import { User } from '../../../domain/entities/user'
import { PgUser } from '../entities/user'
import { RegisterUserParams } from '../../../domain/use-cases/register-user'
import { RegisterUserRepository } from '../../../ports/repositories/register'
import { LoadUserByEmailRepository } from '../../../ports/repositories/load-by-email'
import { SaveUserTokenRepository } from '../../../ports/repositories/save-user-token'

export class PgUserRepository implements RegisterUserRepository, LoadUserByEmailRepository, SaveUserTokenRepository {
  async register (user: RegisterUserParams): Promise <User> {
    const userRepository = getRepository(PgUser)
    const userCreated = userRepository.create(user)
    await userRepository.save(userCreated)
    return userCreated
  }

  async loadByEmail (email: string): Promise <User> {
    const userRepository = getRepository(PgUser)
    const userExits = await userRepository.findOne({ email })
    if (userExits) return userExits
    return null
  }

  async saveUserToken (id: string, token: string): Promise<void> {
    const userRepository = getRepository(PgUser)
    await userRepository.update(id, { token })
  }
}
