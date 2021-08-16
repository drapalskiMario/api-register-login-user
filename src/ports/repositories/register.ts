import { User } from '../../domain/entities/user'
import { RegisterUserParams } from '../../domain/use-cases/register-user'

export interface RegisterUserRepository {
  register (user: RegisterUserParams): Promise<User>
}
