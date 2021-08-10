import { User } from '../entities/user'
import { Error } from './errors'

export type RegisterUserParams = {
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
}

export interface RegisterUser {
  register(registerUserParams: RegisterUserParams): Promise<User | Error>
}
