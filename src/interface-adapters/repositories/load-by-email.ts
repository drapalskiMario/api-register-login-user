import { User } from '../../entities/user'

export interface LoadUserByEmailRepository {
  loadByEmail(email: string): Promise<User>
}
