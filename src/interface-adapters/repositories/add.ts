import { User } from '../../entities/user'
import { AddUserParams } from '../../usecases/add-user/add-user'

export interface AddUserRepository {
  add (user: AddUserParams): Promise<User>
}
