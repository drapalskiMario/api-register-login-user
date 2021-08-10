import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign (value: string): string {
    return 'any_token'
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JwtAdapter', () => {
  test('should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_value')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret')
  })

  test('should retunr an token on success', async () => {
    const sut = makeSut()
    const result = await sut.encrypt('any_value')
    expect(result).toBe('any_token')
  })
})
