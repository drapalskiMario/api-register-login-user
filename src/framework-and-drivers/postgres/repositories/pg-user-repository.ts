import { getRepository } from 'typeorm'
import { User } from '../../../entities/user'
import { AddUserParams } from '../../../usecases/add-user/add-user'
import { AddUserRepository } from '../../../interface-adapters/repositories/add'
import { LoadUserByEmailRepository } from '../../../interface-adapters/repositories/load-by-email'
import { SaveUserTokenRepository } from '../../../interface-adapters/repositories/save-user-token'
import { PgUser } from '../entities/user'

export class UserRepository implements AddUserRepository, LoadUserByEmailRepository, SaveUserTokenRepository {
  async add (user: AddUserParams): Promise <User> {
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
