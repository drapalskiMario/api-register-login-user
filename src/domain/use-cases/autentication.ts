import { Error } from './errors'

export type AuthenticationUserParams = {
  email: string,
  password: string
}

export type Token = {
  token: string
}

export interface AuthenticationUser {
  auth(authenticationUserParams: AuthenticationUserParams): Promise<Token | Error>
}
