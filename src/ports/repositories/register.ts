import { User } from '../../../domain/entities/user'
import { RegisterUserParams } from '../../register-user/register-user'

export interface RegisterUserRepository {
  register (user: RegisterUserParams): Promise<User>
}
