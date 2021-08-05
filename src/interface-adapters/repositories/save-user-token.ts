export interface SaveUserTokenRepository {
  saveUserToken(id: string, token: string): Promise<void>
}
