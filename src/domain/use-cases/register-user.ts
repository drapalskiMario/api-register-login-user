import { User } from '../entities/user'

export type RegisterUserParams = {
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
}

export type RegisterUserResponse = {
  error: string,
  success: User
}
export interface RegisterUser {
  register(registerUserParams: RegisterUserParams): Promise<RegisterUserResponse>
}
