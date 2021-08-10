import { User } from '../../domain/entities/user'

export interface LoadUserByEmailRepository {
  loadByEmail(email: string): Promise<User>
}
