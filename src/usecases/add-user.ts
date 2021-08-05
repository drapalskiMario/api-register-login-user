import { User } from '../entities/user'
import { Hasher } from '../interface-adapters/cryptography/hasher'
import { AddUserRepository } from '../interface-adapters/repositories/add'
import { LoadUserByEmailRepository } from '../interface-adapters/repositories/load-by-email'

export type AddUserParams = Omit <User, 'id'>

export class AddUser {
  constructor (
    private readonly loadUserEmailRepository: LoadUserByEmailRepository,
    private readonly hasher: Hasher,
    private readonly addUserRepository: AddUserRepository
  ) { }

  async add (user: AddUserParams): Promise<User> {
    const userExists = await this.loadUserEmailRepository.loadByEmail(user.email)
    if (!userExists) {
      const hashedPassword = await this.hasher.hash(user.password)
      user.password = hashedPassword
      const resultUser = await this.addUserRepository.add(user)
      return resultUser
    }
    return null
  }
}
