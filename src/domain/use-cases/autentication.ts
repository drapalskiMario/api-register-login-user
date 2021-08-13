export type AuthenticationUserParams = {
  email: string,
  password: string
}

export type AuthenticationUserResponse = {
  success: string,
  error: string
}
export interface AuthenticationUser {
  auth(authenticationUserParams: AuthenticationUserParams): Promise<AuthenticationUserResponse>
}
